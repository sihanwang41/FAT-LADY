INSTALLING THE APPLICATION
1. Install npm
2. Do “npm install”
3. “npm install nodemon -g”
4. install redis server (different commands on different OS)

RUNNING THE APPLICATON
1. “redis-server” will run the redis server
2. do “./bin/www” to run the server
	It will restart automatically every time you change the code

DEVELOPING YOUR MODULE
1. Watch the video:
https://www.codeschool.com/screencasts/soup-to-bits-building-blocks-of-express-js/?utm_medium=email&utm_campaign=recommendation_soup_to_bits&utm_source=mandrill&utm_content=null
2. Follow the middleware format from the example_middleware folder in the middlewareSet branch
3. While developing your module, you might need to install a new package:
npm install <NPM MODULE> --save (see video)
npm shrinkwrap (see video)
4. For testing, you can import the postman template Bill provided us, here:
https://www.getpostman.com/collections/bd855866f763a03a5588
5. After developing your module, put some test cases in the test.js file
6. when you want to run the test you just run “npm test”
	Make sure nothing fails after you have finished
