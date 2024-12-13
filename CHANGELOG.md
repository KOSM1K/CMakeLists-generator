# Change Log

## [0.0.1]

- Initial release!
- Has 1 command - "cmakelists-generator: Generate File List"
  
  scans opened directory recursively, creates "CMakeLists.txt"
  creates minimal-working file

  if "CMakeLists.txt" already exists, then renames old file to "CMakeLists_old.txt"

  if "CMakeLists.txt" and "CMakeLists_old.txt" already exists, then deletes "CMakeLists_old.txt" and behaves same as if only "CMakeLists.txt" existed