import Link from 'next/link'

const WeddingPage = () => (
  <>
    <div className="bg-black align-center text-center mt-20 m-9 block">
      <p className="font-bodo spacing-20 align-middle text-4xl pt-10">April 20, 2026</p>
    </div>
    <div className="bg-white pt-[8rem] pl-10 pr-10 pt-20 pb-20">
      <p className="font-bodo text-black text-xl">CEREMONY</p>
      <p className="font-bodo text-black pt-2">
        Begins Promptly at 4:00 PM at JW Marriott Las Vegas Resort & Spa
      </p>
      <p className="font-bodo text-black pt-2">221 N Rampart Blvd, Las Vegas, NV 89145</p>
      <p className="font-bodo text-black pt-2">
        <Link href="/map" className="text-blue-600 hover:underline">
          Parking & Directions to The Lodge
        </Link>
      </p>
      <p className="font-bodo text-black text-xl pt-10">COCKTAILS</p>
      <p className="font-bodo text-black pt-2">Immediately Following Ceremony</p>
      <p className="font-bodo text-black text-xl pt-10">DRESSCODE</p>
      <p className="font-bodo text-black pt-2">Formal</p>
    </div>
  </>
)

export default WeddingPage
