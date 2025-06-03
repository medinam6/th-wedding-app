import Image from 'next/image'

const MapPage: React.FC = () => (
  <>
    <div className="flex flex-col pt-12 mt-12 items-center py-6">
      <p className="font-bodo text-4xl font-bold text-white text-center mb-2">
        Parking & Directions to The Lodge
      </p>
      <p className="font-bodo text-1xl font-bold text-white pt-6 ml-4">
        You can park at either Option 1 or Option 2, as labeled on the map. From there, follow the
        white arrows to get to The Lodge (marked with a yellow star).
      </p>
      <p className="font-bodo text-1xl font-bold text-white pt-6 ml-4">
        You may take the indoor route through the casino or follow the outdoor path.
      </p>
      <a
        href="https://www.marriott.com/content/dam/marriott-digital/jw/us-canada/hws/l/lasjw/en_us/document/assets/jw-lasjw-resort-map-35516.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View full map
      </a>
    </div>
    <Image src="/map.jpg" alt="Map" width={500} height={300} className="mx-auto rounded-lg" />
  </>
)

export default MapPage
