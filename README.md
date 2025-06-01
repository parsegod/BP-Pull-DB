

                                     𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐭𝐡𝐞 𝐁𝐥𝐮𝐞𝐩𝐫𝐢𝐧𝐭 𝐏𝐮𝐥𝐥 𝐃𝐁!
                             browse, search, and filter weapon blueprints from a 
                                          structured JSON dataset.  
#                                                        𝐓 𝐎 𝐂


* [✨ Key Features](#-key-features)
* [🛠️ Under the Hood](#️-under-the-hood)
* [🚀 Getting Started](#-getting-started)
* [🎮 How to Use](#-how-to-use)
* [📂 Project Structure](#-project-structure)
* [📊 Data Format](#-data-format)
* [💡 Future Ideas](#-future-ideas)
* [🤝 Contributing](#-contributing) 
* [⚖️ License](#️-license)
* [📬 Contact](#-contact)

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

#                                                   🎮 How to Use

Once the application is loaded, you'll find it quite intuitive:

* **Searching**: Locate the "Search Blueprint..." input field at the top. Type in any part of a weapon name or blueprint name, and watch the table update instantly.

* **Filtering by Category**: Click the "Filter Category" button. A dropdown will appear with various weapon categories. Check the boxes next to the categories you want to see. Don't forget the handy "Select All" and "Deselect All" buttons!

* **Filtering by Pool**: Similarly, click the "Filter Pool" button. You'll see a list of blueprint acquisition pools. Select the ones you're interested in.

* **"Show nothing entries" Checkbox**: If you want to include blueprints explicitly marked as "NOTHING" (e.g., placeholders), check this box. Uncheck it to hide them.

* **"Show all images" Checkbox**: This is a neat trick! Check this box to expand all blueprint images simultaneously. Uncheck it to collapse them all back into their accordion state.

* **Viewing Blueprint Images**: For individual blueprints, simply click the small "▶" arrow next to its name in the table. This will expand a row below, revealing the blueprint's image. Click the "▼" again to collapse it.

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

The heart of this application's data lies within the `assets/weapon.json` file. It's structured to be straightforward and easily parsable:


```
{
"Weapons": \[
{
"Name": "Assault Rifle A",
"Category": "0", // This numeric ID maps to "ASSAULT RIFLES"
"Blueprints": \[
{
"Name": "Blueprint Alpha",
"Pool": "Common"
},
{
"Name": "Blueprint Beta",
"Pool": "Rare"
},
{
"Name": "NOTHING",
"Pool": "N/A" // Special entry for placeholders
}
\]
},
{
"Name": "SMG B",
"Category": "1", // This numeric ID maps to "SUBMACHINE GUNS"
"Blueprints": \[
{
"Name": "Blueprint Gamma",
"Pool": "Epic"
},
{
"Name": "UNRELEASED",
"Pool": "N/A" // Another special entry
}
\]
}
\]
}
```

The `categoryMap` in `script.js` is where the magic happens, translating those numeric `Category` IDs into human-readable names:


```
const categoryMap = {
"0": "ASSAULT RIFLES",
"1": "SUBMACHINE GUNS",
"2": "SHOTGUNS",
"3": "LIGHT MACHINE GUNS",
"4": "MARKSMAN RIFLES",
"5": "SNIPER RIFLES",
"6": "PISTOLS",
"7": "LAUNCHERS",
"8": "SPECIAL",
"9": "MELEE"
};
```

**Important Note on Images**: Blueprint images are expected to follow a specific naming convention and path: `assets/blueprints/images/{WeaponName}/{BlueprintName}.jpg`. Ensure your image files match this structure for them to load correctly!

## 💡 Future Ideas

This project is a solid foundation, but there's always room to grow! Here are a few ideas for potential enhancements:

* **Sorting Table Columns**: Add functionality to sort the table by Weapon Name, Category, Blueprint Name, or Pool.

* **More Data Points**: Integrate additional blueprint details like rarity, unlock requirements, or associated events.

* **User Customization**: Allow users to save their filter preferences or even create custom lists of favorite blueprints (requires local storage or a simple backend).

* **Improved Image Handling**: Implement lazy loading for images to boost performance, especially with large datasets.

* **Accessibility Enhancements**: Further improve keyboard navigation and screen reader support.

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

This project is proudly open source and distributed under the **MIT License**. Feel free to use, modify, and distribute it as you see fit!

## 📬 Contact

Have questions, feedback, or just want to chat about blueprints? I'd love to hear from you!

* **Your Name/Handle**: \[Your GitHub Profile Link or Email\]

* **Project Link**: `https://github.com/your-username/blueprint-pull-table` (Please update this link to your actual repository!)

Happy blueprint hunting! 🚀
