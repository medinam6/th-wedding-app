import Image from 'next/image'

const WeddingParty = () => (
  <div className="px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { name: 'Natasha Puckdee', role: 'Matron of Honor', image: '/natasha.jpeg' },
        { name: 'Amanda Kanoknata', role: 'Bridesmaid', image: '/amanda.jpeg' },
        { name: 'Meyvi Medina', role: 'Bridesmaid', image: '/meyvi.jpeg' },
        { name: 'Jessica Villa-Senor Villa', role: 'Bridesmaid', image: '/jessica.jpeg' },
      ].map(member => (
        <div key={member.name} className="text-center">
          <Image
            src={member.image}
            alt={member.name}
            width={500}
            height={300}
            className="mx-auto rounded-lg"
          />
          <p className="font-bodo text-2xl mt-4">{member.name}</p>
          <p className="font-bodo text-md">{member.role}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { name: 'Estevan Enriquez', role: 'Best Man', image: '/estevan.jpeg' },
        { name: 'Aries Caytuero', role: 'Groomsman', image: '/aries.jpeg' },
        { name: 'Bob Morgan', role: 'Groomsman', image: '/estevan.jpeg' },
        { name: 'Frankie Valera', role: 'Groomsman', image: '/frankie.jpeg' },
      ].map(member => (
        <div key={member.name} className="text-center">
          <Image
            src={member.image}
            alt={member.name}
            width={500}
            height={300}
            className="mx-auto rounded-lg"
          />
          <p className="font-bodo text-2xl mt-4">{member.name}</p>
          <p className="font-bodo text-md">{member.role}</p>
        </div>
      ))}
    </div>
  </div>
)

export default WeddingParty
