const AuthImagePattern = ({title, subtitle})=>{

    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-15 relative top-10 min-h-screen">
          <div className="max-w-md text-center flex flex-col justify-center items-center">
            <div className="grid grid-cols-3 gap-3 mb-8 w-60 h-60 ">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl bg-primary/10 ${
                    i % 2 === 0 ? "animate-pulse" : ""
                  }`}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-base-content/60">{subtitle}</p>
          </div>
        </div>
      );
}

export default AuthImagePattern;