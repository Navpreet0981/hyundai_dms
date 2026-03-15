import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({children}){

return(

<div className="flex min-h-screen bg-gray-100 dark:bg-slate-950">

<Sidebar/>

<div className="flex-1 flex flex-col">

<Navbar/>

<main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

</div>

</div>

)

}