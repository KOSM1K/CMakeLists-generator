Ануфриев Даниил Константинович М3103

CMakeLists genertator

Has 1 command - "cmakelists-generator: Generate File List"

scans opened directory recursively, creates "CMakeLists.txt"

creates minimal-working file:

> add_executable(main<br>
> <...all files as *.h, *.c, *.hpp, *.cpp (each in it's own line)><br>
> )

if "CMakeLists.txt" already exists, then renames old file to "CMakeLists_old.txt"

if "CMakeLists.txt" and "CMakeLists_old.txt" already exists, then deletes "CMakeLists_old.txt" and behaves same as if only "CMakeLists.txt" existed
