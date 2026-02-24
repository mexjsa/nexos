import http.server
import socketserver
import json
import csv
import os
from datetime import datetime

PORT = 8000
CSV_FILE = 'leads.csv'

class LeadRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/submit-lead':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                self.save_lead(data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Lead saved'}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving lead: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "File not found")

    def save_lead(self, data):
        file_exists = os.path.isfile(CSV_FILE)
        
        # Add timestamp
        data['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Define fields based on chatbot flow
        fieldnames = ['timestamp', 'interest_type', 'business_size', 'session_interest', 
                      'name', 'company_name', 'preferred_contact', 'whatsapp', 'phone', 'email', 'preferred_schedule']
        
        # Filter data to only include known fields (plus any extras just in case)
        # For simplicity in CSV, we'll stick to expected fields, or dynamic layout? 
        # Dynamic is better so we don't lose data if flow changes.
        
        # Let's get all keys from data to ensure we capture everything
        keys = list(data.keys())
        
        # If file exists, we might need to update headers if new keys appear? 
        # For this MVP, let's just use the predefined list + dynamic keys sorted.
        # Actually, standard CSV writers need consistent fieldnames. 
        # Let's use the superset of fields we expect from the flow.
        
        with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            
            if not file_exists:
                writer.writeheader()
            
            writer.writerow(data)
            print(f"Lead saved: {data}")

print(f"Server started at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), LeadRequestHandler) as httpd:
    httpd.serve_forever()
