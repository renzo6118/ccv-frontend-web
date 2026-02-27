import { useState } from 'react'
import { User, CreditCard, Calendar, LogOut, Lock, IdCard, AlertTriangle, QrCode, MapPin, Clock, List } from 'lucide-react'

const API_URL = "https://ccv-api.onrender.com" 

export function App() {
  // 1. TODAS LAS VARIABLES DE ESTADO
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)
  const [finanzas, setFinanzas] = useState(null)
  const [misReservas, setMisReservas] = useState([]) // <--- Nueva memoria para el historial
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [resetUser, setResetUser] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [reservaSede, setReservaSede] = useState('1') 
  const [reservaHora, setReservaHora] = useState('10:00 AM')
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 1, 1)) 
  const [reservaFecha, setReservaFecha] = useState('2026-02-28')

  // 2. FUNCIONES
  const formatFecha = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const cargarMisReservas = async (id_socio) => {
    try {
      const response = await fetch(`${API_URL}/reservas/misReservas/${id_socio}`)
      const data = await response.json()
      if (response.ok) setMisReservas(data.reservas)
    } catch (err) {
      console.log("Error al cargar historial")
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/autenticacion/autenticarSocio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, password: password })
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data.datosSocio)
        cargarFinanzas(data.datosSocio.id_socio)
        cargarMisReservas(data.datosSocio.id_socio) // Cargamos el historial al entrar
        setView('finanzas')
      } else {
        setError(data.detail || "Credenciales incorrectas")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
    }
    setLoading(false)
  }

  const cargarFinanzas = async (id_socio) => {
    try {
      const response = await fetch(`${API_URL}/finanzas/consultarEstadoCuenta/${id_socio}`)
      const data = await response.json()
      if (response.ok) setFinanzas(data)
    } catch (err) {
      console.log("Error al cargar finanzas")
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPass !== confirmPass) return alert("¡Las contraseñas no coinciden!")
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/autenticacion/actualizarPassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: resetUser, nuevaPassword: newPass })
      })
      if (response.ok) {
        alert('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.')
        setView('login')
      } else {
        alert('Error: No se encontró al socio.')
      }
    } catch (err) {
      alert('Error de conexión con el servidor')
    }
    setLoading(false)
  }

  // 3. VISTAS
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="bg-ccvGreen w-full h-64 flex flex-col items-center justify-center rounded-b-[40px] shadow-lg">
          <div className="w-20 h-20 bg-ccvGreen border-2 border-white/30 rounded-full flex items-center justify-center mb-3">
            <span className="text-white text-3xl font-serif font-bold">CC</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">Portal de Socios</h1>
          <p className="text-green-100/80 text-sm mt-1">Country Club Exclusivo</p>
        </div>

        <div className="w-11/12 max-w-md bg-white rounded-3xl shadow-xl p-8 -mt-12 relative z-10 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wider">DNI O CÓDIGO DE SOCIO</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" placeholder="Ej: rminaya"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ccvGreen focus:ring-1 focus:ring-ccvGreen transition-all text-gray-700 font-medium"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wider">CONTRASEÑA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="password" placeholder="••••••••"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ccvGreen focus:ring-1 focus:ring-ccvGreen transition-all text-gray-700 font-medium"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-ccvGreen text-white font-bold rounded-xl py-3.5 hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20 text-lg">
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p onClick={() => setView('recuperar')} className="text-sm text-ccvGreen font-bold cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </p>
            <p className="text-xs text-gray-400 mt-4 px-4 leading-relaxed font-medium">
              Las credenciales de acceso son generadas exclusivamente por el área de Administración del club.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'recuperar') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-50 text-ccvGreen rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Nueva Contraseña</h2>
          
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block ml-1 uppercase">Usuario o DNI</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="rminaya" required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ccvGreen text-gray-700 font-medium"
                  value={resetUser} onChange={(e) => setResetUser(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block ml-1 uppercase">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input type="password" placeholder="••••••••" required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ccvGreen text-gray-700 font-medium"
                  value={newPass} onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block ml-1 uppercase">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input type="password" placeholder="••••••••" required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ccvGreen text-gray-700 font-medium"
                  value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-ccvGreen text-white font-bold rounded-xl py-3.5 hover:bg-green-800 shadow-lg text-lg mt-2">
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
          
          <button onClick={() => setView('login')} className="w-full mt-6 text-sm text-gray-400 hover:text-gray-600 font-bold">
            Cancelar y volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      <div className="bg-white px-6 py-5 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <h2 className="text-xl font-bold text-gray-800 capitalize">
          {view === 'perfil' ? 'Carnet Digital' : view === 'reservas' ? 'Agendar Reserva' : view === 'mis_reservas' ? 'Mis Reservas' : 'Finanzas'}
        </h2>
        <div className="w-10 h-10 bg-ccvGreen text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
          {user?.nombres.charAt(0)}
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        
        {view === 'finanzas' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-gray-500 text-sm font-semibold">Deuda Total Consolidada</p>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-red-100">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pendiente
                </span>
              </div>
              <div className="mt-3 mb-6 relative z-10">
                <span className="text-gray-400 text-2xl font-medium">S/ </span>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                  {finanzas ? finanzas.deuda_total.toFixed(2) : "0.00"}
                </span>
                <p className="text-sm text-gray-400 mt-2 font-medium">Próximo vencimiento: 28 de Febrero</p>
              </div>
              <button className="w-full bg-ccvGreen text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-green-800 transition-colors relative z-10 text-lg">
                Pagar ahora
              </button>
            </div>

            <h3 className="text-gray-800 font-bold text-lg mt-8 mb-4 px-1">Detalle de movimientos</h3>
            <div className="space-y-3">
              {finanzas?.detalle_cuentas.map((cuenta, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cuenta.estado === 'Pagado' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-base">{cuenta.periodo}</p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">Mantenimiento Club</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gray-900 text-lg">S/ {cuenta.monto}</p>
                    <p className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-md inline-block ${cuenta.estado === 'Pendiente' || cuenta.estado === 'Vencido' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {cuenta.estado}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'perfil' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden text-center pb-10">
              <div className="h-32 bg-ccvGreen w-full rounded-b-[2rem]"></div>
              <div className="-mt-16 flex justify-center">
                <div className="w-32 h-32 bg-white rounded-3xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {user?.nombres.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="mt-4 px-4">
                <h3 className="text-2xl font-bold text-gray-800">{user?.nombres}</h3>
                <p className="text-gray-400 font-medium mt-1">Socio Titular</p>
              </div>
              <div className="mt-4 flex justify-center">
                <span className="bg-green-50 text-green-600 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 border border-green-100">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div> Estado: Habilitado
                </span>
              </div>
              <div className="w-full border-t-[3px] border-dashed border-gray-100 my-8"></div>
              <div className="flex flex-col items-center justify-center px-8">
                <div className="p-4 border-[3px] border-gray-100 rounded-3xl shadow-sm bg-white">
                  <QrCode className="w-48 h-48 text-gray-800" />
                </div>
                <p className="text-xs text-gray-400 font-bold tracking-[0.2em] mt-6 uppercase">Escanear en portería</p>
              </div>
            </div>
          </div>
        )}

        {/* --- NUEVA VISTA: MIS RESERVAS (HISTORIAL) --- */}
        {view === 'mis_reservas' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="text-gray-800 font-bold text-xl mb-4 px-1">Mis reservas</h3>
            <div className="space-y-4">
              {misReservas.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
                  <List className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Aún no tienes reservas programadas.</p>
                  <button onClick={() => setView('reservas')} className="mt-4 text-ccvGreen font-bold hover:underline">Agendar mi primera reserva</button>
                </div>
              ) : (
                misReservas.map((res, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center border-l-4 border-l-ccvGreen transition-transform hover:scale-[1.02]">
                    <div>
                      <p className="font-extrabold text-gray-800 text-lg">
                        {res.sede.replace('Sede ID: 1', 'Sede Villa').replace('Sede ID: 2', 'Sede Chosica').replace('Sede ID: 3', 'Sede Sur')}
                      </p>
                      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-ccvGreen" /> {res.fecha}
                      </p>
                      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-ccvGreen" /> {res.horario}
                      </p>
                    </div>
                    <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      {res.estado}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'reservas' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
            <div>
              <h3 className="text-gray-500 text-sm font-bold flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Seleccionar Sede</h3>
              <select 
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 outline-none focus:border-ccvGreen focus:ring-1 focus:ring-ccvGreen text-gray-700 font-bold shadow-sm appearance-none cursor-pointer"
                value={reservaSede}
                onChange={(e) => setReservaSede(e.target.value)}
              >
                <option value="1">Sede Villa</option>
                <option value="2">Sede Chosica</option>
                <option value="3">Sede Sur</option>
              </select>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-gray-800 text-lg capitalize">
                  {calendarDate.toLocaleString('es-ES', { month: 'long' })} {calendarDate.getFullYear()}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} 
                    className="text-gray-400 hover:text-gray-800 p-1 font-bold transition-colors"
                  >
                    &lt;
                  </button>
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} 
                    className="text-gray-400 hover:text-gray-800 p-1 font-bold transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 font-bold mb-3">
                <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 text-center text-sm font-bold text-gray-700">
                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`blank-${i}`}></div>
                ))}
                
                {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const fechaStr = formatFecha(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                  const isSelected = reservaFecha === fechaStr;
                  
                  return (
                    <div 
                      key={day}
                      onClick={() => setReservaFecha(fechaStr)}
                      className={`cursor-pointer w-9 h-9 flex items-center justify-center mx-auto rounded-xl transition-all ${isSelected ? 'bg-gray-900 text-white shadow-md' : 'hover:bg-gray-100 hover:text-ccvGreen'}`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-gray-500 text-sm font-bold flex items-center gap-2 mb-3"><Clock className="w-4 h-4"/> Horario</h3>
              <div className="grid grid-cols-2 gap-3">
                {['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'].map((hora) => (
                  <button 
                    key={hora}
                    onClick={() => setReservaHora(hora)}
                    className={`py-3.5 rounded-xl font-bold transition-all shadow-sm ${reservaHora === hora ? 'bg-green-50 text-ccvGreen border-ccvGreen ring-1 ring-ccvGreen' : 'border border-gray-200 bg-white text-gray-500 hover:border-ccvGreen hover:text-ccvGreen hover:bg-green-50'}`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                try {
                  const response = await fetch(`${API_URL}/reservas/registrarReserva`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      idSocio: user.id_socio,
                      idInstalacion: parseInt(reservaSede),
                      fecha: reservaFecha,
                      horaInicio: reservaHora,
                      horaFin: "N/A"
                    })
                  })
                  const data = await response.json()
                  if (response.ok) {
                    alert(`${data.mensaje}\nCódigo de tu reserva: ${data.codigoReserva}`)
                    cargarMisReservas(user.id_socio) // Actualiza la lista
                    setView('mis_reservas') // Lo manda directo a ver su historial
                  } else {
                    alert(`Error: ${data.detail}`)
                  }
                } catch (err) {
                  alert("Error de conexión con el servidor al reservar.")
                }
                setLoading(false)
              }}
              className="w-full bg-ccvGreen text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-800 transition-colors mt-2 text-lg"
            >
              {loading ? "Procesando..." : "Confirmar Reserva"}
            </button>
          </div>
        )}

      </div>

      {/* 5 BOTONES EN LA BARRA INFERIOR */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-3 px-1 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView('perfil')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${view === 'perfil' ? 'text-ccvGreen' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className={`${view === 'perfil' ? 'bg-green-50 text-ccvGreen' : 'text-gray-400'} rounded-xl p-1.5 transition-colors`}><User className="w-5 h-5" /></div>
          <span className="text-[9px] font-bold">Perfil</span>
        </button>
        <button onClick={() => setView('finanzas')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${view === 'finanzas' ? 'text-ccvGreen' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className={`${view === 'finanzas' ? 'bg-green-50 text-ccvGreen' : 'text-gray-400'} rounded-xl p-1.5 transition-colors`}><CreditCard className="w-5 h-5" /></div>
          <span className="text-[9px] font-bold">Finanzas</span>
        </button>
        <button onClick={() => setView('reservas')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${view === 'reservas' ? 'text-ccvGreen' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className={`${view === 'reservas' ? 'bg-green-50 text-ccvGreen' : 'text-gray-400'} rounded-xl p-1.5 transition-colors`}><Calendar className="w-5 h-5" /></div>
          <span className="text-[9px] font-bold">Agendar</span>
        </button>
        {/* NUEVO BOTÓN */}
        <button onClick={() => setView('mis_reservas')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${view === 'mis_reservas' ? 'text-ccvGreen' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className={`${view === 'mis_reservas' ? 'bg-green-50 text-ccvGreen' : 'text-gray-400'} rounded-xl p-1.5 transition-colors`}><List className="w-5 h-5" /></div>
          <span className="text-[9px] font-bold">Mis Reservas</span>
        </button>
        <button onClick={() => {setUser(null); setView('login')}} className="flex flex-col items-center gap-1 w-14 text-gray-400 hover:text-red-500 transition-colors">
          <div className="p-1.5"><LogOut className="w-5 h-5" /></div>
          <span className="text-[9px] font-bold">Salir</span>
        </button>
      </div>
    </div>
  )
}