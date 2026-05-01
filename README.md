# Roy Huaman | Fullstack Developer Portfolio 🚀

¡Bienvenido a mi portafolio profesional! Esta es una aplicación web de alto rendimiento construida con las tecnologías más modernas del ecosistema web, enfocada en la velocidad, seguridad y una experiencia de usuario excepcional.

## 🛠️ Tecnologías Core

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Diseño moderno y utilitario)
- **Base de Datos y Auth:** [Supabase](https://supabase.com/) (PostgreSQL + SSR Auth)
- **Backend Logic:** Server Actions de Next.js
- **Seguridad:** [Upstash Redis](https://upstash.com/) (Rate Limiting)
- **Correos:** [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Diseño:** [Figma Design System](https://www.figma.com/design/2uNE6FVu4m73Du7ka7U07W/Portafolio?node-id=24-32&t=PAUoyeVJmJHKbklz-1)

## ✨ Características Destacadas

### ⚡ Rendimiento de Alto Nivel

- **Optimización de Fuentes:** Uso de `next/font` para eliminar el Cumulative Layout Shift (CLS).
- **Priorización LCP:** Optimización de imágenes críticas (Logo y Hero) con `fetchpriority="high"`.
- **Preconexión:** Reducción de latencia mediante `preconnect` a orígenes remotos (Cloudinary/Supabase).
- **Skeleton Screens:** Cargas asíncronas con `Suspense` para una percepción de carga instantánea.

### 🔒 Seguridad y Resiliencia

- **Rate Limiting:** Protección contra spam en el formulario de contacto usando una ventana deslizante de Redis.
- **Honeypot:** Protección invisible contra bots en formularios.
- **Validación Robusta:** Esquemas de validación con `Yup` tanto en cliente (Formik) como en servidor.
- **Headers de Seguridad:** Configuración de `X-Frame-Options`, `X-Content-Type-Options` y más.

### ♿ Accesibilidad (A11Y)

- Cumplimiento de estándares ARIA.
- Soporte completo para navegación por teclado (incluyendo cierre de menús con `Esc`).
- Gestión de foco y etiquetas descriptivas para lectores de pantalla.

### 🧪 Calidad de Código

- **Testing:** Suite de pruebas unitarias y de integración con [Vitest](https://vitest.dev/).
- **CI/CD:** Pipeline automatizado con GitHub Actions que valida Linting, Tests y Build en cada Push.

## 🚀 Instalación y Desarrollo Local

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/royandresdev/portafolio-2026.git
    cd portafolio-2026
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` basado en `.env.example`:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
    NEXT_RESEND_API_KEY=tu_api_key_de_resend
    UPSTASH_REDIS_REST_URL=tu_url_de_upstash
    UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🧪 Ejecución de Pruebas

Para ejecutar la suite de pruebas con Vitest:

```bash
npm test
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Diseñado y desarrollado con ❤️ por [Roy Huaman](https://www.linkedin.com/in/royhuamanavila)
