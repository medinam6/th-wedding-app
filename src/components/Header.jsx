import Link from 'next/link'

const Header = () => (
  <div className="mt-4">
    <Link className="font-bodo text-2xl p-6" href={'/the-wedding'}>
      Teresa and Henry
    </Link>
  </div>
)

export default Header
