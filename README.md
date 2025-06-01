



                                        𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐭𝐡𝐞 𝐁𝐥𝐮𝐞𝐩𝐫𝐢𝐧𝐭 𝐏𝐮𝐥𝐥 𝐃𝐁!
                                browse, search, and filter weapon blueprints from a 
                                             structured JSON dataset.
                                             
                                        𝗰𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆 𝗟𝗶𝗮𝗺 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗱 𝗯𝘆 𝗣𝗮𝗿𝘀𝗲
*  Owner : [Liam][my-website]
*  Revampd : [Parse][creator-site]


[my-website]: https://parsegod.github.io/BP-Pull-DB/ "My Awesome Portfolio"
[creator-site]: https://liamcky.github.io/BlueprintPulling/
#                                                        𝐓 𝐎 𝐂

* [✨ Key Features](#-key-features)
* [🛠️ Under the Hood](#️-under-the-hood)
* [🚀 Getting Started](#-getting-started)
* [🎮 How to Use](#-how-to-use)
* [📂 Project Structure](#-project-structure)
* [📊 Data Format](#-data-format)
* [🤝 Contributing](#-contributing) 
* [⚖️ License](#️-license)
#                                                   ✨ 𝐊𝐞𝐲 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬
* **Blueprint Display**: Continuly Updated list of blueprints

* **Instant Search**: Pinpoint specific weapons or blueprints in a flash.

* **Smart Category Filtering**:  Help with narrowing down your results.

* **Flexible Pool Filtering**: Filter by `# Pool` to see exactly what blueprints pull what.

* **"Nothing" Entry Toggle**:  Easily hide or show "NOTHING" blueprint entries to keep your view clutter-free.

* **Batch Image Viewing**:  A single toggle lets you expand or collapse every associated image, perfect for quick browsing.

* **Accordion Details**: Click on `►` next to any blueprint name to reveal its corresponding image.

#                                                   🛠️ Source

* **HTML5 (`index.html`)**: 
* provides the semantic structure for the table, search bar, filters, and all interactive elements.

* **CSS3 (`style.css`)**: 
* visual aesthetics, responsive layout, dropdown animations, and a clean, dark-theme.

* **JavaScript (ES6+) (`script.js`)**: 

  * Fetching and parsing the `weapon.json` data.

  * rendering the table rows and blueprint images.

  * live search functionality.

  * Managing category and pool filters.

  * show all images" toggle.

  * Ensuring user interactions are smooth and responsive.

#                                                   🚀 Getting Started

Ready to get this blueprint tracker up and running on your local machine? It's super simple!

1. **Clone the Repository**:
   First things first, grab a copy of the project files. Open your terminal or command prompt and run:


    ```
    git clone [https://github.com/Liamcky/BlueprintPulling)
    ```

2. **Navigate to the Project Directory**:

    ```
    cd blueprint-pull-table
    ```

3. **Crucial:**  `assets/weapon.json`
* `0This application relies on a weapon.json file located in the assets/ directory to populate its data. Please ensure this file exists and is correctly formatted according to the Data Format section below. If it's missing, the table won't load any data.`

4. **Open in Your Browser**:
* You can simply double-click the `index.html` file to open it in your default web browser.
*Self-hosting for development?* For a more robust development experience (especially if you're making changes), consider using a local web server. Python's built-in server is a great option:


    ```
    # run from the project root directory ( {ProjectLocation}/BlueprintPulling )
    python -m http.server 8000
    ```

* Then, open your browser and go to `http://localhost:8000`.

#                                                   📂 File Tree

* qiuck example of the file tree


    ```
    .
    ├── index.html          
    ├── script.js           
    ├── style.css           
    └── assets/             
        ├── weapon.json    
        └── blueprints/     
           └── images/     
               ├── WeaponName1/
               │   ├── BlueprintName1.jpg
              │   └── BlueprintName2.jpg
              └── WeaponName2/
                    ├── BlueprintNameA.jpg
                    └── BlueprintNameB.jpg
    ```

#                                                    📊 Data Format

The `categoryMap` in `script.js` is where the magic happens, translating those numeric `Category` IDs into human-readable names:

**Important Note on Images**: Blueprint images are expected to follow a specific naming convention and path: `assets/blueprints/images/{WeaponName}/{BlueprintName}.jpg`. Ensure your image files match this structure for them to load correctly

## 🤝 Contributing

* Contributions are absolutely welcome! If you have an idea for a new feature, spot a bug, or just want to improve the code, please don't hesitate to get involved.
* ### ⇩ Want to help?  ⇩
1. **Fork the Repository**: Start by forking this project to your own GitHub account.
2. **Create a New Branch**: Make your changes in a dedicated branch:
    ```
    git checkout -b feature/your-awesome-feature
    ```
* (Or `fix/bug-description` for bug fixes!)
3. **Commit Your Changes**: 
    ```
    git commit -m 'feat: Add amazing new filter option'
    ```
4. **Push to Your Branch**: 
    ```
    git push origin feature/your-awesome-feature
    ```
5. **Open a Pull Request**: 

   `  Describe your changes clearly, and we'll review them!`

* **Please do not rip, and make sure all `Owners & Contributors` are well Credited.**

## ⚖️ License

* This project is proudly open source and distributed under the **MIT License**. Feel free to use, modify, and distribute it as you see fit!


* **Creator Link**: `https://github.com/Liamcky/BlueprintPulling`

* # Happy blueprint hunting! 🚀
