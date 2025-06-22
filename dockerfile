# indicamos la imagen base del proyecto
FROM node

# esteblecemos el nombre de la app 

WORKDIR /entregafinal-70435

# copiar los archivos de la aplicacion al contenedor

COPY package.json ./
RUN npm install
COPY . .

# exponer el puerto de la aplicacion
EXPOSE 4000

# Definimos el comando para ejecutar la app
CMD [ "npm","start" ]

