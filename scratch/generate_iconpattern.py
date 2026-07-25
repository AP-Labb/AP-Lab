import math
import random
from PIL import Image, ImageDraw

def create_pixel_icon_pattern():
    # Tile size 256x256
    width, height = 256, 256
    img = Image.new("RGBA", (width, height), (9, 11, 22, 255))
    draw = ImageDraw.Draw(img)
    
    # Pixel grid size: 8x8 pixels per block
    block_size = 6
    
    # Grid offset
    grid = [
        # Left '<' symbol (diamond steps)
        (4, 18), (5, 17), (6, 16), (7, 15), (6, 14), (5, 13), (4, 12),
        (5, 19), (6, 18), (7, 17), (8, 16), (7, 15), (6, 14), (5, 13),
        (3, 19), (3, 20), (4, 21), (5, 21), (6, 21), (7, 21),
        
        # Center '/' diagonal slash
        (16, 6), (15, 7), (15, 8), (14, 9), (14, 10), (13, 11), (13, 12), (12, 13), (12, 14), (11, 15), (11, 16), (10, 17), (10, 18), (9, 19), (9, 20), (8, 21), (8, 22), (7, 23), (7, 24),
        (17, 7), (16, 8), (16, 9), (15, 10), (15, 11), (14, 12), (14, 13), (13, 14), (13, 15), (12, 16), (12, 17), (11, 18), (11, 19), (10, 20), (10, 21), (9, 22), (9, 23), (8, 24),
        
        # Right '>' symbol
        (20, 6), (21, 6), (22, 6), (23, 7), (24, 8), (25, 9), (24, 10), (23, 11), (22, 12), (23, 13), (24, 14), (25, 15), (24, 16), (23, 17),
        (19, 7), (20, 7), (21, 7), (22, 8), (23, 9), (24, 10), (23, 11), (22, 12), (23, 13), (24, 14), (23, 15), (22, 16),
        
        # Secondary tile offset (repeat top-left)
        (2, 2), (3, 3), (4, 4), (3, 5), (2, 6),
    ]
    
    # Draw blocks with pixelated noise texture
    for (gx, gy) in grid:
        x0 = gx * block_size
        y0 = gy * block_size
        
        for bx in range(block_size):
            for by in range(block_size):
                px = (x0 + bx) % width
                py = (y0 + by) % height
                
                # Dither noise variation
                noise = random.uniform(0.7, 1.0)
                
                # Color gradient: Cyan (#38bdf8) to Teal (#20c997)
                r = int((0.1 * noise + 0.1) * 255)
                g = int((0.75 * noise) * 255)
                b = int((0.95 * noise) * 255)
                a = int(random.uniform(0.8, 1.0) * 255)
                
                img.putpixel((px, py), (r, g, b, a))
                
    # Save image
    img.save("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/iconpattern.png", "PNG")
    print("Saved public/images/iconpattern.png successfully!")

if __name__ == "__main__":
    create_pixel_icon_pattern()
