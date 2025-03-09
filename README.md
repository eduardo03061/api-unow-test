## Endpoints

### Autenticación

- **Registro**
  - **URL**: `/users`
  - **Método**: `POST`
  - **Descripción**: Registra un nuevo usuario.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Respuesta**:
    ```json
    {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "user": {
        "email": "user@example.com",
        "id": "user_id"
      }
    }
    ```

- **Inicio de sesión**
  - **URL**: `/users/login`
  - **Método**: `POST`
  - **Descripción**: Inicia sesión con un usuario existente.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Respuesta**:
    ```json
    {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "user": {
        "email": "user@example.com",
        "id": "user_id"
      }
    }
    ```

### CRUD de Empleados

- **Listar Empleados**
  - **URL**: [users](http://_vscodecontentref_/0)
  - **Método**: `GET`
  - **Descripción**: Obtiene una lista de empleados con paginación y búsqueda.
  - **Parámetros de consulta**:
    - [page](http://_vscodecontentref_/1): Número de página (opcional)
    - [limit](http://_vscodecontentref_/2): Límite de resultados por página (opcional)
    - [search](http://_vscodecontentref_/3): Término de búsqueda (opcional)
  - **Respuesta**:
    ```json
    {
      "employees": [
        {
          "id": "employee_id",
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      ],
      "total": 1,
      "page": 1,
      "totalPages": 1
    }
    ```

- **Crear Empleado**
  - **URL**: [users](http://_vscodecontentref_/4)
  - **Método**: `POST`
  - **Descripción**: Crea un nuevo empleado.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
  - **Respuesta**:
    ```json
    {
      "id": "employee_id",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

- **Actualizar Empleado**
  - **URL**: `/users/:id`
  - **Método**: `PATCH`
  - **Descripción**: Actualiza los datos de un empleado existente.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "name": "John Doe Updated"
    }
    ```
  - **Respuesta**:
    ```json
    {
      "id": "employee_id",
      "name": "John Doe Updated",
      "email": "john.doe@example.com"
    }
    ```

- **Eliminar Empleado**
  - **URL**: `/users/:id`
  - **Método**: `DELETE`
  - **Descripción**: Elimina un empleado existente.
  - **Respuesta**:
    ```json
    {
      "message": "User successfully deleted"
    }
    ```

### Ejecución de Pruebas

Agrega una sección que explique cómo ejecutar las pruebas para tu API.

```markdown
 