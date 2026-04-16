import NavBar from "../../components/navBar";

export default function AboutPage() {
  return (
    
    <main style={{ padding: '2rem', margin: '0 auto', lineHeight: 1.6 }}>
      <NavBar />
      <h1>About the Store</h1>

      <p><strong>Welcome!</strong> We're a small team curating high-quality cups & accessories for everyday moments.</p>

      <section>
        <h2>Our story</h2>
        <p>Started in 2023 from a love of great design and thoughtful materials, we focus on sustainable, long-lasting products chosen with care.</p>
      </section>

      <section>
        <h2>What we sell</h2>
        <p>Reusable cups, ceramic mugs, travel tumblers, and curated accessories — each item is selected for quality, function, and style.</p>
      </section>

      <section>
        <h2>Shipping & Returns</h2>
        <p>We offer fast domestic shipping and easy returns within 30 days. Contact us for international orders and special requests.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:hello@example.com">hello@example.com</a> or use our contact form. We're happy to help!</p>
      </section>

    </main>
  )
}
