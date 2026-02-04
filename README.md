# Aztlan 2026

Sistema de registro de participantes para el evento Aztlan 2026. Esta aplicación web permite a los participantes registrarse en diferentes categorías según su edad: Infantil, Juvenil, Adultos y Masters.

## 📋 Descripción del Proyecto

Aztlan 2026 es una aplicación web desarrollada con Next.js que facilita el proceso de registro de participantes para un evento. La aplicación cuenta con una interfaz moderna y responsiva que permite a los usuarios seleccionar su categoría de registro y completar un formulario con sus datos personales.

### Características

- 🎯 **Múltiples categorías de registro**: Infantil, Juvenil, Adultos y Masters
- 📱 **Diseño responsivo**: Optimizado para dispositivos móviles, tablets y escritorio
- 🎨 **Interfaz moderna**: Diseño limpio con animaciones suaves y efectos visuales
- ⚡ **Rendimiento optimizado**: Construido con Next.js 14 para máxima velocidad
- 🔒 **TypeScript**: Código tipado para mayor seguridad y mantenibilidad

## 🛠️ Tecnologías Utilizadas

- **Next.js 14.2.5** - Framework de React para producción
- **React 18.3.1** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript 5.5.3** - Superset de JavaScript con tipado estático
- **Tailwind CSS 3.4.4** - Framework de CSS utility-first
- **PostCSS** - Herramienta para transformar CSS

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** (gestor de paquetes)

Para verificar que tienes Node.js instalado, ejecuta en tu terminal:

```bash
node --version
npm --version
```

## 🚀 Pasos para Ejecutar el Proyecto Localmente

### 1. Clonar el repositorio

Si aún no tienes el proyecto, clónalo desde el repositorio:

```bash
git clone <url-del-repositorio>
cd aztlan-2026
```

### 2. Instalar dependencias

Instala todas las dependencias necesarias del proyecto:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo Next.js, React, TypeScript y Tailwind CSS.

### 3. Ejecutar el servidor de desarrollo

Inicia el servidor de desarrollo de Next.js:

```bash
npm run dev
```

El servidor se iniciará y podrás acceder a la aplicación en:

**http://localhost:3000**

### 4. Abrir en el navegador

Abre tu navegador web y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

## 📝 Scripts Disponibles

El proyecto incluye los siguientes scripts en `package.json`:

- `npm run dev` - Inicia el servidor de desarrollo en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción (requiere ejecutar `build` primero)
- `npm run lint` - Ejecuta el linter para verificar errores de código

## 📁 Estructura del Proyecto

```
aztlan-2026/
├── app/
│   ├── components/
│   │   └── RegistroForm.tsx    # Componente reutilizable del formulario
│   ├── registro/
│   │   ├── juvenil/            # Página de registro infantil y juvenil (6-17 años)
│   │   ├── adultos/            # Página de registro adultos
│   │   └── masters/            # Página de registro masters
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal de la aplicación
│   └── page.tsx                # Página principal (home)
├── next.config.js              # Configuración de Next.js
├── tailwind.config.js          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias y scripts del proyecto
```

## 🎯 Uso de la Aplicación

1. **Página Principal**: Al acceder a la aplicación, verás una página con tres tarjetas: Registro Infantil y Juvenil, Adultos y Masters.

2. **Selección de Categoría**: Haz clic en la tarjeta de la categoría que corresponda a tu edad:
   - **Infantil**: Para participantes menores de edad
   - **Juvenil**: Para participantes jóvenes
   - **Adultos**: Para participantes adultos
   - **Masters**: Para participantes masters

3. **Completar Formulario**: Una vez seleccionada la categoría, completa el formulario con tus datos personales:
   - Nombre
   - Apellido
   - Email
   - Teléfono
   - Fecha de nacimiento

4. **Enviar Registro**: Haz clic en el botón "Enviar Registro" para completar el proceso.

## 🔧 Configuración Adicional

### Variables de Entorno

Si necesitas configurar variables de entorno, crea un archivo `.env.local` en la raíz del proyecto:

```env
# Ejemplo de variables de entorno
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📄 Licencia

Este proyecto es privado y todos los derechos están reservados.

## 👥 Contribución

Para contribuir al proyecto, por favor contacta al equipo de desarrollo.

---

**© 2026 Aztlan. Todos los derechos reservados.**
