import openpyxl
from openpyxl_image_loader import SheetImageLoader

pxl_doc = openpyxl.load_workbook("c:/users/ryanw/downloads/PaldeaPokedex.xlsx")
sheet = pxl_doc["Sheet1"]

image_loader = SheetImageLoader(sheet)


for i in range(400):
    image = image_loader.get("E" + str(i + 2))
    image.save(fp="c:/users/ryanw/pokemonImages/pokemon" + str(sheet["A" + str(i + 2)].value) + ".png")
    try: 
        image = image_loader.get("F" + str(i + 2))
        image.save(fp="c:/users/ryanw/pokemonImages/pokemon" + str(sheet["A" + str(i + 2)].value) + "B.png")
    except:
        pass
    try: 
        image = image_loader.get("G" + str(i + 2))
        print("more than two pics")
        image.save(fp="c:/users/ryanw/pokemonImages/pokemon" + str(sheet["A" + str(i + 2)].value) + "C.png")
    except:
        pass
    try: 
        image = image_loader.get("H" + str(i + 2))
        print("more than three pics")
        image.save(fp="c:/users/ryanw/pokemonImages/pokemon" + str(sheet["A" + str(i + 2)].value) + "D.png")
    except:
        pass
    try: 
        image = image_loader.get("I" + str(i + 2))
        print("more than four pics")
        image.save(fp="c:/users/ryanw/pokemonImages/pokemon" + str(sheet["A" + str(i + 2)].value) + "E.png")
    except:
        pass