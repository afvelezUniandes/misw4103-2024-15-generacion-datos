## Configuración Inicial

1. Asegúrate de tener Node.js versión 16.x instalada.
2. Instala las dependencias del proyecto:

```bash
npm install
```

## Configuración de Ghost

1. Para la version 5.96

```bash
docker image pull ghost:5.96

docker run --name my-ghost -e NODE_ENV=development -e url=http://localhost:2368 -p 2368:2368 ghost:5.96
```

2. Configuramos usuario admin para 5.96

```bash
http://localhost:2368/ghost
```

### Ejecutamos las pruebas de cypress

1. El archivo de configuracion para cypress es cypress.config.js, en el debes cambiar el usuario y la contraseña

```bash
npx cypress run
```
