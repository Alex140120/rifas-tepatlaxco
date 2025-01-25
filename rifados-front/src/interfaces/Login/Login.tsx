import { useEffect, useState } from "react";

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (password2 && password && usuario) {
      if (password === password2) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
    else {
        setDisabled(true);
    }
  }, [usuario, password, password2]);

  return (
    <div
      className="w-100 p-0 m-0 d-flex justify-content-center align-items-center bg-dark"
      style={{ height: "100vh" }}
    >
      <div className="bg-light card py-3 px-5 card-login">
        <h4 className="text-center mb-1">Acceso Administrador</h4>
        <hr />
        <div className="flex-column w-100 mb-2">
          <label htmlFor="correo-usuario" className="t2">
            Usuario o correo:
          </label>
          <input
            type="text"
            name="correo-usuario"
            id="correo-usuario"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className="flex-column w-100 mb-2">
          <label htmlFor="password" className="t2">
            Contraseña:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex-column w-100 mb-3">
          <label htmlFor="password" className="t2">
            Confirma tu contraseña:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center text-dark">
          <button className="button" disabled={disabled}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
