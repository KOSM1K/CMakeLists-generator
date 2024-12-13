import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('generateFileList', async () => {
        // Get the current workspace folder
        const folders = vscode.workspace.workspaceFolders;

        if (!folders || folders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        const rootPath = folders[0].uri.fsPath; // Get the path to the root of the first workspace folder
        const fileList: string[] = [];

        try {
            getAllFiles(rootPath, fileList);

            const cppFiles = fileList
                .map(file => path.relative(rootPath, file)) // Convert to relative path
                .filter(file => ['.c', '.cpp', '.h', '.hpp'].includes(path.extname(file))); // filter by extension

            if (cppFiles.length === 1) {
                vscode.window.showInformationMessage(`Found ${cppFiles.length} matching file.`);
            } else if (cppFiles.length > 1){
                vscode.window.showInformationMessage(`Found ${cppFiles.length} matching files.`);
            } else {
                vscode.window.showInformationMessage('No matching files found.');
            }

            // creating file
            if (cppFiles.length > 0){
                const outputPath = path.join(rootPath, 'CMakeLists.txt');
                if (fs.existsSync(outputPath)){
                    const oldFileName = path.join(rootPath, 'CMakeLists_old.txt');
                    
                    if (fs.existsSync(oldFileName)){
                        (fs.rmSync(oldFileName));
                    }
                    
                    fs.renameSync(outputPath, oldFileName);
                }
                fs.truncate(outputPath, (err) => {if (err) {throw err;}});
                fs.writeFileSync(outputPath, 'add_executable(main\n', {'encoding': 'utf-8', 'flag' : 'a'});
                fs.writeFileSync(outputPath, cppFiles.join('\n'), {'encoding': 'utf-8', 'flag' : 'a'});
                fs.writeFileSync(outputPath, '\n)', {'encoding': 'utf-8', 'flag' : 'a'});
                
                vscode.window.showInformationMessage(`File list created at ${outputPath}`);
            }
            
        } catch (error) {
            console.error(error);
            vscode.window.showErrorMessage('Failed to generate file list.');
        }
    });

    context.subscriptions.push(disposable);
}

// Recursively collect all files in a directory
function getAllFiles(dirPath: string, fileList: string[] = []): void {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            getAllFiles(fullPath, fileList); // Recurse into subdirectory
        } else {
            fileList.push(fullPath); // Add file path to the list
        }
    }
}

export function deactivate() {}
