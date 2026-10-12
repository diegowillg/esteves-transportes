// Envia um formulário por e-mail usando o FormSubmit (formsubmit.co), sem servidor.
// No primeiro envio para cada endereço, o FormSubmit manda um e-mail de ativação:
// basta clicar em "Activate" uma vez.
//
// fields: objeto { 'Rótulo': 'valor' } que aparece como tabela no e-mail.
// file: arquivo opcional (ex.: currículo), enviado como anexo.
export async function sendForm({ to, subject, replyTo, fields, file }) {
  const meta = { _subject: subject, _template: 'table', _captcha: 'false', ...(replyTo && { _replyto: replyTo }) }
  const url = `https://formsubmit.co/ajax/${to}`
  let res
  if (file) {
    const fd = new FormData()
    for (const [k, v] of Object.entries({ ...meta, ...fields })) fd.append(k, v)
    fd.append('attachment', file, file.name)
    res = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
  } else {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...meta, ...fields }),
    })
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'Falha no envio')
  return json
}
