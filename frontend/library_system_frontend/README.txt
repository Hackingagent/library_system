LIBRARY MANAGEMENT SYSTEM FRONTEND — HTML + CSS ONLY

HOW TO USE:
1. Extract library_system_linked_frontend.zip.
2. Copy the contents (index.html, other HTML pages, and css folder) into:
   your Laravel project / public / frontend /
3. Start Laravel from the library_system folder:
   php artisan serve
4. Open:
   http://127.0.0.1:8000/frontend/index.html

PAGES:
- index.html          Dashboard
- students.html       Students
- books.html          Books
- authors.html        Authors
- shelves.html        Shelves
- student-books.html  Student–Book pivot records
- book-authors.html   Book–Author pivot records
- css/style.css       Shared styling for every page

All navigation links are connected using relative HTML links.
The search fields and forms are visual only. No JavaScript is used, and no form saves data until connected to Laravel routes/controllers.
