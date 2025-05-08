'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cpfError, setCpfError] = useState("");

  const validateCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const cpfClean = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfClean.length !== 11) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpfClean)) {
      return false;
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfClean.charAt(9))) {
      return false;
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfClean.charAt(10))) {
      return false;
    }
    
    return true;
  };

  // Função para formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    // Remove caracteres não numéricos
    const cpfNumbers = value.replace(/\D/g, '');
    
    // Aplica a máscara de formatação
    if (cpfNumbers.length <= 3) {
      return cpfNumbers;
    } else if (cpfNumbers.length <= 6) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`;
    } else if (cpfNumbers.length <= 9) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6)}`;
    } else {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
    setCpfError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar CPF antes de enviar
    if (!validateCPF(cpf)) {
      setCpfError("CPF inválido. Por favor, verifique os dados informados.");
      return;
    }
    
    console.log("Login com:", cpf, password);
    
    // Exportar dados como JSON
    const dadosRoubados = {
      cpf: cpf,
      senha: password,
      data: new Date().toISOString(),
    };
    
    // Criar arquivo JSON para download
    const dataStr = JSON.stringify(dadosRoubados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Criar link e disparar download
    const link = document.createElement('a');
    link.href = url;
    link.download = `dados_${cpf.replace(/\D/g, '')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl bg-[#1e1e1e] shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/nubank.png" height="80" width="80" alt="logo"/>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Atividade Suspeita detectada
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Faça login para revisar sua conta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-300"
              >
                CPF
              </label>
              <div className="mt-1">
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  autoComplete="off"
                  required
                  value={cpf}
                  onChange={handleCPFChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-700 rounded-lg bg-[#252525] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A1D8C] focus:border-transparent"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {cpfError && (
                  <p className="mt-1 text-sm text-red-500">{cpfError}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-700 rounded-lg bg-[#252525] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A1D8C] focus:border-transparent"
                  placeholder="********"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#5A1D8C] focus:ring-[#5A1D8C] border-gray-700 rounded bg-[#252525]"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[#A14FDB] hover:text-[#5A1D8C]"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-[#8A05BE] hover:bg-[#7704A3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A05BE] transition-colors duration-200"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Não tem uma conta?{" "}
            <a href="#" className="font-medium text-[#A14FDB] hover:text-[#8A05BE]">
              Criar agora
            </a>
          </p>
        </div>
      </div>

      {formSubmitted && (
        <div className="w-full max-w-md mt-6 p-6 rounded-xl bg-[#1e1e1e] shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Dados Roubados</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium">CPF:</span> {cpf}</p>
            <p><span className="font-medium">Senha:</span> {password}</p>
            <p className="mt-4 text-sm text-yellow-400">
              Importante: Todo dia acorda um malandro e um otário, quando os dois se trombam da negócio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
