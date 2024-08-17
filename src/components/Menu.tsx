import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Bars3Icon } from "@heroicons/react/16/solid"

const NavMenu = () => {
  const menuList = ['Home Page', 'THE WEDDING', 'EVENTS', 'OUR STORY', 'WEDDING PARTY', 'REGISTRY', 'RSVP', 'FAQ']
  
  return (<div className="top-0 m-5 flex justify-end text-right">
	<Menu>
		<MenuButton className="inline-flex items-center gap-2 py-1.5 px-3 text-sm/6 font-semibold text-black focus:outline-none ">
			<Bars3Icon className="size-8 fill-white" />
		</MenuButton>

		<MenuItems
			transition
			anchor="bottom end"
			className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
		>
      {menuList.map((item, index) =>(
        <>
       <MenuItem key={item}>
        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
        <p className="font-pop">
        {item}
        </p>
        </button>
      </MenuItem>
      {index === 0 &&
        <div className="my-1 h-px bg-white/15" />}
    </>
      ))}
        </MenuItems>
	</Menu>
</div>)}

export default NavMenu