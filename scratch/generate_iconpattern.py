import random
from PIL import Image, ImageDraw, ImageFilter

def generate_exact_screenshot_icon_pattern():
    # Card size matching ProfileCard (500x700)
    width, height = 500, 700
    img = Image.new("RGBA", (width, height), (9, 11, 24, 255))
    draw = ImageDraw.Draw(img)
    
    # Pixel block size for dithered glyphs
    pixel_size = 4
    
    # Precise pixel map of the exact symbol in the screenshot:
    # 1. Left L-bracket: (0,4) to (0,8) and (0,8) to (4,8)
    # 2. Diagonal center zig-zag: (3,0) to (8,10)
    # 3. Top-Right 7-bracket: (7,0) to (11,0) and (11,0) to (11,4)
    
    symbol_pixels = []
    # Left L-bracket (corner)
    for y in range(4, 9):
        symbol_pixels.append((0, y))
        symbol_pixels.append((1, y))
    for x in range(1, 5):
        symbol_pixels.append((x, 7))
        symbol_pixels.append((x, 8))
        
    # Diagonal zig-zag staircase
    for i in range(11):
        x = 3 + (i * 5) // 10
        y = i
        symbol_pixels.append((x, y))
        symbol_pixels.append((x + 1, y))
        
    # Right 7-bracket (corner)
    for x in range(7, 12):
        symbol_pixels.append((x, 0))
        symbol_pixels.append((x, 1))
    for y in range(1, 5):
        symbol_pixels.append((10, y))
        symbol_pixels.append((11, y))

    # Symbol placement coordinates matching screenshot
    placements = [
        {"x": 20, "y": 60, "scale": 1.2, "bright": 0.7, "color": (56, 189, 248)},   # Top-Left
        {"x": 40, "y": 240, "scale": 1.4, "bright": 0.6, "color": (147, 197, 253)}, # Mid-Left
        {"x": 50, "y": 500, "scale": 1.3, "bright": 0.5, "color": (32, 201, 151)},  # Bottom-Left
        {"x": 340, "y": 140, "scale": 1.5, "bright": 0.9, "color": (56, 189, 248)}, # Top-Right
        {"x": 200, "y": 340, "scale": 1.6, "bright": 1.0, "color": (255, 255, 255)}, # Center Chest (Glowing)
        {"x": 210, "y": 590, "scale": 1.3, "bright": 0.8, "color": (200, 240, 255)}, # Bottom-Center
    ]

    for p in placements:
        base_x, base_y = p["x"], p["y"]
        col = p["color"]
        bright = p["bright"]
        sc = p["scale"]
        
        for (px, py) in symbol_pixels:
            for bx in range(int(pixel_size * sc)):
                for by in range(int(pixel_size * sc)):
                    ix = int(base_x + px * pixel_size * sc + bx)
                    iy = int(base_y + py * pixel_size * sc + by)
                    
                    if 0 <= ix < width and 0 <= iy < height:
                        # Dither noise & glow
                        noise = random.uniform(0.75, 1.0)
                        r = int(min(255, col[0] * bright * noise))
                        g = int(min(255, col[1] * bright * noise))
                        b = int(min(255, col[2] * bright * noise))
                        a = int(min(255, 240 * bright * noise))
                        img.putpixel((ix, iy), (r, g, b, a))

    img.save("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/iconpattern.png", "PNG")
    print("Saved public/images/iconpattern.png matching exact screenshot layout!")

if __name__ == "__main__":
    generate_exact_screenshot_icon_pattern()
