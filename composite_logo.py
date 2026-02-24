from PIL import Image
import os

# Note: Using forward slashes or raw strings to navigate paths safely
bg_path = r"c:/Users/Juan/.gemini/antigravity/brain/4244dfff-5350-4aac-9408-aae0b95e1a4f/nexo_ia_background_v6_clean_1771013517099.png"
logo_path = r"c:/Users/Juan/.gemini/antigravity/scratch/agency_web/nexo_ia_neon_logo.png"
output_path = r"c:/Users/Juan/.gemini/antigravity/scratch/agency_web/nexo_ia_background.png"

print(f"Loading background from: {bg_path}")
print(f"Loading logo from: {logo_path}")

try:
    if not os.path.exists(bg_path):
        raise FileNotFoundError(f"Background not found: {bg_path}")
    if not os.path.exists(logo_path):
        # Fallback to brain directory if not in scratch
        logo_path = r"c:/Users/Juan/.gemini/antigravity/brain/4244dfff-5350-4aac-9408-aae0b95e1a4f/nexo_ia_neon_logo_1771001256352.png"
        print(f"Logo not found in scratch, trying brain: {logo_path}")
        if not os.path.exists(logo_path):
             raise FileNotFoundError(f"Logo not found: {logo_path}")

    bg = Image.open(bg_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")

    # Resize logo
    # Target about 30% of the background width
    target_width = int(bg.width * 0.30) 
    aspect_ratio = logo.height / logo.width
    target_height = int(target_width * aspect_ratio)
    
    # High quality resize
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Position: Top right area
    # Center of logo should be around 75% width, 25% height
    x_pos = int(bg.width * 0.65) 
    y_pos = int(bg.height * 0.10) - int(target_height * 0.1) # Slightly adjusting up

    print(f"Compositing logo at {x_pos}, {y_pos} with size {target_width}x{target_height}")

    # Create new image for composition to handle alpha correctly
    final_img = Image.new("RGBA", bg.size)
    final_img.paste(bg, (0,0))
    final_img.paste(logo, (x_pos, y_pos), logo) # Use logo as mask

    # Save
    final_img.save(output_path, format="PNG")
    print(f"Successfully saved composite image to {output_path}")

except Exception as e:
    print(f"Error during composition: {e}")
    exit(1)
