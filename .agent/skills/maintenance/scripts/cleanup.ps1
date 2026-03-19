param (
    [switch]$SkipDryRun,
    [switch]$FullAudit
)

$DryRun = -not $SkipDryRun
$threeMonthsAgo = (Get-Date).AddDays(-90)
$sizeThreshold = 5 * 1024 * 1024 # 5MB

Write-Host "`n--- INICIANDO MANTENIMIENTO: BIENVENIDO JUAN ---" -ForegroundColor Cyan

# 1. Downloads Scan
$downloadsPath = Join-Path $env:USERPROFILE "Downloads"
Write-Host "Escanenado Descargas: $downloadsPath" -ForegroundColor Gray
$filesToDelete = @()
if (Test-Path $downloadsPath) {
    $allFiles = Get-ChildItem -Path $downloadsPath -File -Recurse | Where-Object { $_.FullName -notmatch "Telegram Desktop$" }
    foreach ($file in $allFiles) {
        if (($file.LastAccessTime -lt $threeMonthsAgo -and $file.LastWriteTime -lt $threeMonthsAgo) -or (($file.Extension -match "exe|msi|zip|rar|7z") -and ($file.Length -gt $sizeThreshold))) {
            $filesToDelete += [PSCustomObject]@{ Name=$file.Name; SizeMB=[Math]::Round($file.Length / 1MB, 2); Path=$file.FullName }
        }
    }
}

# 2. System Audit (Memory & Hidden Apps)
if ($FullAudit) {
    Write-Host "`n--- AUDITORÍA DE RECURSOS (SYSTEM SCAN) ---" -ForegroundColor Magenta
    
    # Large Apps/Games Scan
    Write-Host "Buscando aplicaciones pesadas (Steam/Games/Runtimes)..."
    Get-Package | Where-Object { $_.Name -match "Age of Empires|Project Zomboid|Steam|Microsoft 365" } | Select-Object Name, ProviderName, Version | Format-Table -AutoSize
    
    # Memory Hogs
    Write-Host "Analizando procesos con alto consumo de RAM..."
    Get-Process | Where-Object { $_.WorkingSet -gt 200MB } | Select-Object Name, @{Name="RAM(MB)"; Expression={[Math]::Round($_.WorkingSet / 1MB, 2)}} | Sort-Object "RAM(MB)" -Descending | Format-Table -AutoSize
}

# 3. Execution/Report
if ($filesToDelete.Count -gt 0) {
    $totalSize = ($filesToDelete | Measure-Object -Property SizeMB -Sum).Sum
    Write-Host "`n--- RESUMEN DE ARCHIVOS PARA ELIMINAR ---" -ForegroundColor Yellow
    Write-Host "Total candidates: $($filesToDelete.Count) | Liberable: $totalSize MB"
    $filesToDelete | Sort-Object SizeMB -Descending | Select-Object -First 5 | Format-Table Name, SizeMB

    if ($DryRun) {
        Write-Host "[DRY RUN] No se borró nada. Usa -SkipDryRun para limpiar." -ForegroundColor Green
    } else {
        foreach ($f in $filesToDelete) { Remove-Item -Path $f.Path -Force -ErrorAction SilentlyContinue }
        Write-Host "¡Limpieza de archivos completada!" -ForegroundColor Green
    }
} else {
    Write-Host "No se encontraron archivos para eliminar en Descargas." -ForegroundColor Gray
}

Write-Host "`nMantenimiento finalizado." -ForegroundColor Cyan
