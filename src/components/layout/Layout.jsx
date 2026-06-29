import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CookieBanner from '../util/CookieBanner.jsx'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
