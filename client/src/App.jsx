import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "./lib/api";

function Nav({ cartCount, user, onLogout }) {
  return (
    <nav className="nav">
      <Link className="brand" to="/">
        ShopSphere
      </Link>

      <div className="navlinks">
        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {user && (
          <Link to="/orders">
            Orders
          </Link>
        )}

        {user ? (
          <button
            className="linkbtn"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <section className="hero">
      <span className="eyebrow">
        Modern full-stack commerce
      </span>

      <h1>
        Shop simple. Order fast.
      </h1>

      <p>
        Browse products, build a cart and place orders
        with a clean commerce workflow.
      </p>

      <Link
        className="primary"
        to="/products"
      >
        Shop Products
      </Link>
    </section>
  );
}

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "customer@example.com",
    password: "Password123",
  });

  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      const response = await api(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      onLogin(response.user);

      window.location.href = "/products";
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="page narrow">
      <form
        className="card form"
        onSubmit={submit}
      >
        <h2>Login</h2>

        <input
          className="input"
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
          placeholder="Email"
        />

        <input
          className="input"
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm({
              ...form,
              password: event.target.value,
            })
          }
          placeholder="Password"
        />

        <button className="primary">
          Login
        </button>

        {message && (
          <p className="error">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

function Products({ add }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api("/products")
      .then((response) => {
        setItems(response.products);
      })
      .catch(() => {
        setItems([
          {
            _id: "p1",
            name: "Wireless Headphones",
            price: 79,
            category: "Audio",
          },
          {
            _id: "p2",
            name: "Mechanical Keyboard",
            price: 109,
            category: "Workspace",
          },
          {
            _id: "p3",
            name: "USB-C Hub",
            price: 39,
            category: "Accessories",
          },
        ]);
      });
  }, []);

  const visible = useMemo(() => {
    return items.filter((product) =>
      product.name
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }, [items, q]);

  return (
    <section className="page">
      <div className="row between">
        <div>
          <h2>Products</h2>

          <p className="muted">
            Search the catalogue.
          </p>
        </div>

        <input
          className="input small"
          placeholder="Search products"
          value={q}
          onChange={(event) =>
            setQ(event.target.value)
          }
        />
      </div>

      <div className="grid">
        {visible.map((product) => (
          <article
            className="card"
            key={product._id}
          >
            <span className="chip">
              {product.category}
            </span>

            <h3>{product.name}</h3>

            <p className="price">
              ${product.price}
            </p>

            <button
              className="primary"
              onClick={() => add(product)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Cart({ cart, checkout }) {
  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.qty,
    0
  );

  return (
    <section className="page narrow">
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p className="muted">
          Your cart is empty.
        </p>
      ) : (
        cart.map((product) => (
          <div
            className="card row between"
            key={product._id}
          >
            <div>
              <h3>{product.name}</h3>

              <p>
                {product.qty} × ${product.price}
              </p>
            </div>

            <strong>
              $
              {(
                product.qty * product.price
              ).toFixed(2)}
            </strong>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <div className="card">
          <h3>
            Total: ${total.toFixed(2)}
          </h3>

          <button
            className="primary"
            onClick={() => checkout(total)}
          >
            Place Order
          </button>
        </div>
      )}
    </section>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api("/orders")
      .then((response) => {
        setOrders(response.orders);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page">
      <h2>My Orders</h2>

      <div className="grid">
        {orders.map((order) => (
          <article
            className="card"
            key={order._id}
          >
            <h3>
              Order #{order._id.slice(-6)}
            </h3>

            <p>
              ${order.total.toFixed(2)}
            </p>

            <span className="chip">
              {order.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  const add = (product) => {
    setCart((currentCart) => {
      const found = currentCart.find(
        (item) => item._id === product._id
      );

      if (found) {
        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  };

  const checkout = async (total) => {
    try {
      await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item._id,
            quantity: item.qty,
            price: item.price,
          })),
          total,
        }),
      });

      setCart([]);

      window.location.href = "/orders";
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/";
  };

  return (
    <>
      <Nav
        cartCount={cart.reduce(
          (sum, product) =>
            sum + product.qty,
          0
        )}
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={
            <Login onLogin={setUser} />
          }
        />

        <Route
          path="/products"
          element={
            <Products add={add} />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              checkout={checkout}
            />
          }
        />

        <Route
          path="/orders"
          element={<Orders />}
        />
      </Routes>
    </>
  );
}

export default App;