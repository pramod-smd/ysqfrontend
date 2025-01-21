export const getFiles = async () => {
    // Dynamically import JSON files from a specific directory (e.g., './data')
    const files = import.meta.glob('./**/*.json');  // Use Vite's glob import feature
    console.log("files",files);
    
    const modules = {};

    // Loop through the files and import them
    for (const [key, value] of Object.entries(files)) {
        const fileName = key.replace('./', '');
        const resource = await value();  // This will load the JSON file
        const namespace = fileName.replace('.json', '');
        modules[namespace] = resource;  // Save the imported JSON in the modules object
    }

    return modules;
};
