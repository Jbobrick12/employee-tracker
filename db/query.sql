-- Hopefully this gets all the employees along with their roles and departments
SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, departments.name AS department
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id;