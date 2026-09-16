import PaymentIcons from "@/components/icons/PaymentIcons";

export default function Footer() {
    return (
        <footer className="w-full bg-[#222327] text-white">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-4 py-16 md:px-[60px] md:py-[140px] lg:grid-cols-[531.75px_1fr]">

                {/* Lewa część */}
                <div className="flex flex-col gap-6">
                    <div className="text-2xl font-bold">
                        <span className="text-orange-400">Nexus</span>
                        <span className="text-white">Hub</span>
                    </div>

                    <p className="text-sm leading-5 text-gray-300">
                        © 2023 NexusHub. All
                        <br />
                        rights reserved.
                    </p>

                    <PaymentIcons />
                </div>

                {/* Prawa część */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">

                    <div className="flex flex-col gap-8">
                        <h3 className="font-semibold">Company</h3>

                        <div className="flex flex-col gap-4 text-sm text-gray-300">
                            <p>About Us</p>
                            <p>Contact</p>
                            <p>Partner</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h3 className="font-semibold">Social</h3>

                        <div className="flex flex-col gap-4 text-sm text-gray-300">
                            <p>Instagram</p>
                            <p>Twitter</p>
                            <p>Facebook</p>
                            <p>LinkedIn</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h3 className="font-semibold">FAQ</h3>

                        <div className="flex flex-col gap-4 text-sm text-gray-300">
                            <p>Account</p>
                            <p>Deliveries</p>
                            <p>Orders</p>
                            <p>Payments</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h3 className="font-semibold">Resources</h3>

                        <div className="flex flex-col gap-4 text-sm text-gray-300">
                            <p>E-books</p>
                            <p>Tutorials</p>
                            <p>Course</p>
                            <p>Blog</p>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}