# MailDesk

Interfaz de una herramienta personal para preparar campañas de correo, contactos y reportes. Esta primera versión no envía correos ni se conecta con proveedores externos: usa datos ficticios y conserva los borradores solo durante la sesión actual.

## Ejecutar localmente

```bash
pnpm install
pnpm dev
```

Para generar el paquete de producción:

```bash
pnpm build
```

## Tecnologías

- React + TypeScript
- Tailwind CSS
- Recharts
- Lucide React

La carpeta `src/lib` concentra datos de demostración y la estructura está separada por pantallas y componentes para facilitar una futura integración con Supabase, almacenamiento y un proveedor de envío.
