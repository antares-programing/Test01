import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import "./index.css";

const empanadas = [
  { id: 1, nombre: "Carne", descripcion: "Clásica empanada de carne", precio: 120 },
  { id: 2, nombre: "Jamón y Queso", descripcion: "Sabrosa y cremosa", precio: 110 },
  { id: 3, nombre: "Pollo", descripcion: "Pollo desmenuzado con especias", precio: 115 },
  { id: 4, nombre: "Capresse", descripcion: "Tomate, albahaca y queso", precio: 125 },
];

const imagen = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjz68n8D_XKOTKq1Lj7e92Qvp4a0w_D3BKrA&s";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const formRef = useRef();

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarPedido = (e) => {
    e.preventDefault();
    const datos = new FormData(formRef.current);
    const mensaje = carrito.map(item =>
      `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`
    ).join("\n");

    datos.append("input", mensaje + `\n\nTOTAL: $${total}`);

    emailjs.sendForm("service_zpo793f", "template_d4la3jq", formRef.current, "user_placeholder")
      .then(() => alert("Pedido enviado correctamente."))
      .catch(() => alert("Error al enviar pedido."));
  };

  return (
    <div className="p-4">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Empan Hadas</h1>
        <div className="space-x-4">
          <a href="#menu" className="hover:text-yellow-600">Menú</a>
          <a href="#contacto" className="hover:text-yellow-600">Contacto</a>
          <button onClick={() => setMostrarCarrito(!mostrarCarrito)}>🛒</button>
        </div>
      </nav>

      <section id="menu" className="grid md:grid-cols-2 gap-4 my-6">
        {empanadas.map(emp => (
          <div key={emp.id} className="border rounded shadow p-4">
            <img src={imagen} alt={emp.nombre} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{emp.nombre}</h2>
            <p>{emp.descripcion}</p>
            <p className="font-bold">${emp.precio}</p>
            <button onClick={() => agregarAlCarrito(emp)} className="bg-yellow-500 mt-2 text-white px-3 py-1 rounded hover:bg-yellow-600">Agregar</button>
          </div>
        ))}
      </section>

      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Tu Pedido</h3>
            {carrito.map(item => (
              <p key={item.id}>{item.nombre} x{item.cantidad} - ${item.precio * item.cantidad}</p>
            ))}
            <p className="font-bold mt-2">Total: ${total}</p>
            <form ref={formRef} onSubmit={enviarPedido} className="mt-4 space-y-2">
              <input name="name" required className="border w-full p-1" placeholder="Nombre completo" />
              <input name="phone" required className="border w-full p-1" placeholder="Teléfono" />
              <input name="email" required className="border w-full p-1" placeholder="Correo electrónico" />
              <textarea name="input" hidden />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enviar Pedido</button>
            </form>
            <button onClick={() => setMostrarCarrito(false)} className="mt-2 text-sm text-gray-500">Cerrar</button>
          </div>
        </div>
      )}

      <section id="contacto" className="my-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Contacto</h2>
        <form ref={formRef} onSubmit={enviarPedido} className="space-y-2">
          <input name="name" required className="border w-full p-2" placeholder="Nombre completo" />
          <input name="phone" required className="border w-full p-2" placeholder="Teléfono" />
          <input name="email" required className="border w-full p-2" placeholder="Correo electrónico" />
          <textarea name="input" required className="border w-full p-2" placeholder="Mensaje" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enviar Mensaje</button>
        </form>
      </section>
    </div>
  );
}

export default App;