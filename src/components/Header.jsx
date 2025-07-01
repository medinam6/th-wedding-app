import Link from 'next/link'

const Header = () => (
  <div className="fixed top-5 left-5 z-100 p-2">
    <Link className="font-bodo text-2xl p-6" href={'/the-wedding'}>
      Teresa and Henry
    </Link>
  </div>
)

export default Header
