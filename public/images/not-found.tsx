import Link from "next/link";

export default function NotFound() {
return (
    <div className="items-center flex lmax-lg:flex-row"> 
                <div className="flex-col w-2/3">
                    <img className="float-left object-cover w-full" src="https://www.creative-tim.com/twcomponents/svg/404-error-with-broken-robot-pana.svg" alt="Error" />
                </div>           
                <div className="flex-col">
                    <div className="">
                        <div className="">
                            <div className="">                                
                            <div className="text-5xl font-black text-gray-800 md:text-8xl">
                                404</div>
                                <div className="w-16 h-1 my-3 bg-primary md:my-6"></div>
                                <p className="text-xl font-light leading-normal text-gray-600 md:text-lg">
                                err:PageNotFound_010PNF236 </p>
                                <a href="/">
                                <button className="bg-blue-600 px-4 py-2 mt-4 text-lg text-white transition-colors duration-300 transform border rounded-lg hover:bg-gray-100  hover:text-black ">
                                Go Home
                                </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}