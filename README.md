# Node Simple Login & Nested Set
A simple Login Using NodeJS and MongoDB

===
###Installation Guide:  

1. Install docker by follow [this step](https://docs.docker.com/engine/installation/)  
2. Install docker compose by follow [this step](https://docs.docker.com/compose/install/)  
3. Clone this project  
``git clone https://github.com/asrulsibaoel/node-simple-login.git /your/destination/folder``
4. Change your destination path on your terminal to your project root ( ``cd /your/project/`` )  
5. ```docker-compose build``` then ```docker-compose up```  

###How to remote MongoDB
mongodb is running at port 27018, so you can access from computer host (also via ssh tunnel) to 127.0.0.1:27018

###Generate Documentation  
1. Install apidocjs : ``npm install -g apidoc``  
2. Change your path to your project directory :  
``cd /path/to/your/project``  
3. Generate the docs :  
``apidoc -i src/Http/ -o documentation/``  
4. It will generate a new directory named 'documentation'. Just double click on index.html inside it.