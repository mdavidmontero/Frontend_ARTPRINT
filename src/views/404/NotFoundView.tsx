import { Link } from "react-router-dom";

export default function NotFoundView() {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">
        Página no Encontrada{" "}
      </h1>
      <p className="mt-10 text-xl text-center text-white">
        Tal vez quiera volver a la{" "}
        <Link className="text-fuchsia-500 " to={"/"}>
          Tienda
        </Link>
      </p>
    </>
  );
}
