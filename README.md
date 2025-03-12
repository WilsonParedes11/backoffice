# Backoffice Project

Este proyecto es una aplicación de backoffice desarrollada con React, TypeScript, Vite y Supabase.

## Requisitos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/WilsonParedes11/backoffice
    cd backoffice
    ```

2. Instala las dependencias:

    ```bash
    npm install
    # o
    yarn install
    ```

3. Configura las variables de entorno:

    Crea un archivo `.env` en la raíz del proyecto y copia el contenido de `.env.example`. Luego, completa las variables necesarias:

    ```bash
    cp .env.example .env
    ```


## Configuracion de supabase.

## 1. Tabla admins
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

## 2. Tabla forms

CREATE TABLE forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

## 3. Tabla questions

CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'multi_select', 'short_answer')),
  title TEXT NOT NULL,
  options JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

## Políticas de RLS Corregidas

## 1. Tabla admins

  -- Habilitar RLS
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

  -- Permitir a usuarios autenticados insertar su propio registro
  CREATE POLICY "Admins can insert their own data"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

  -- Permitir a usuarios autenticados leer su propio registro
  CREATE POLICY "Admins can read their own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

  -- Permitir a usuarios autenticados actualizar su propio registro
  CREATE POLICY "Admins can update their own data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
  Explicación:
  Solo el usuario autenticado cuyo id coincide con auth.uid() puede insertar, leer o actualizar su propio registro.
  Esto asegura que un administrador no pueda modificar datos de otro.

## 2. Tabla forms

  -- Habilitar RLS
  ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

  -- Permitir a admins crear formularios
  CREATE POLICY "Admins can create forms"
  ON forms
  FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

  -- Permitir a admins leer sus propios formularios
  CREATE POLICY "Admins can read their own forms"
  ON forms
  FOR SELECT
  TO authenticated
  USING (admin_id = auth.uid());

  -- Permitir a admins actualizar sus propios formularios
  CREATE POLICY "Admins can update their own forms"
  ON forms
  FOR UPDATE
  TO authenticated
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

  -- Permitir a admins eliminar sus propios formularios
  CREATE POLICY "Admins can delete their own forms"
  ON forms
  FOR DELETE
  TO authenticated
  USING (admin_id = auth.uid());
  Explicación:
  Solo el administrador cuyo id coincide con auth.uid() puede gestionar (crear, leer, actualizar, eliminar) sus propios formularios.
## 3. Tabla questions

  -- Habilitar RLS
  ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

  -- Permitir a admins crear preguntas en sus formularios
  CREATE POLICY "Admins can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = questions.form_id 
      AND forms.admin_id = auth.uid()
    )
  );

  -- Permitir a admins leer preguntas de sus formularios
  CREATE POLICY "Admins can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = questions.form_id 
      AND forms.admin_id = auth.uid()
    )
  );

  -- Permitir a admins actualizar preguntas de sus formularios
  CREATE POLICY "Admins can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = questions.form_id 
      AND forms.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = questions.form_id 
      AND forms.admin_id = auth.uid()
    )
  );

  -- Permitir a admins eliminar preguntas de sus formularios
  CREATE POLICY "Admins can delete questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = questions.form_id 
      AND forms.admin_id = auth.uid()
    )
  );

## URl del Sistema en producion.
https://backoffice-iota-ten.vercel.app/login

1. Para acceder a la gestion del sistema debe crear un cuenta.
2. Confirma el registro en su email que sera evia a su correo
3. una vez confirmado el email tiene acceso a la gestion del sistema.