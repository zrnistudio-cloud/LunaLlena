
# En Luna Llena

Portal editorial lunar con dos recorridos principales:
- `Eventos en luna llena`
- `Luna y bienestar`

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Publicación

El proyecto quedó preparado para publicarse en GitHub Pages desde la carpeta `docs`.

Pasos:
1. En GitHub, abrir el repositorio `zrnistudio-cloud/LunaLlena`.
2. Ir a `Settings > Pages`.
3. En `Build and deployment`, elegir `Deploy from a branch`.
4. Elegir branch `main`.
5. Elegir carpeta `/docs`.
6. Guardar.

Cada vez que quieras actualizar la web:

```bash
npm run build
rm -rf docs
mkdir docs
cp -R dist/. docs/
git add docs
git commit -m "Update published site"
git push origin main
```

## Dominio propio

Cuando compres el dominio:
1. Configuramos el dominio en `Settings > Pages`.
2. Agregamos el archivo `public/CNAME` con tu dominio final.
3. Apuntamos DNS del dominio a GitHub Pages.

## Nota técnica

Las rutas `/eventos` y `/bienestar` quedaron preparadas con fallback estático para que funcionen correctamente en GitHub Pages.
  
