const Footer = () => {
  return (
    <div className="bg-accent py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-3xl text-black font-bold tracking-tight">
          LXBNB
        </span>
        <span className="text-black font-bold tracking-tight flex gap-4">
          <p className="cursor-pointer hover:text-secondary transition-colors duration-300">Privacy Policy</p>
          <p className="cursor-pointer hover:text-secondary transition-colors duration-300">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
