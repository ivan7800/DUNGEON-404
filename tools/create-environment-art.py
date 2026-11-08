"""Original vector wall reliefs. Regenerate with Python 3; no third-party artwork."""
from pathlib import Path
from math import cos, sin, pi
ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'art'
FRAME = '''<rect width="256" height="256" fill="#172327"/><path d="M0 32H256M0 96H256M0 160H256M0 224H256M64 0V32M192 0V32M32 32V96M128 32V96M224 32V96M64 96V160M192 96V160M32 160V224M128 160V224M224 160V224" stroke="#080e12" stroke-width="3"/>
<path d="M38 239V84Q38 48 128 12Q218 48 218 84V239Z" fill="#080f17" stroke="#927b58" stroke-width="4"/>
<path d="M48 234V86Q48 54 128 24Q208 54 208 86V234" fill="none" stroke="#405a58" stroke-width="3"/>
<path d="M19 8V248M237 8V248" stroke="#66746b" stroke-width="9"/>
<path d="M9 20H29M227 20H247M9 53H29M227 53H247M9 222H29M227 222H247M9 244H29M227 244H247" stroke="#b2a27a" stroke-width="5"/>'''
SEAL = '<path d="M128 34L143 43V59L128 68L113 59V43Z M113 51H143M128 35V67M119 58L128 42L137 58Z" fill="none" stroke="#86d3c3" stroke-width="1.5"/>'
def svg(title, body):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><title>{title}</title>{FRAME}{SEAL}{body}</svg>\n'
crypt = '''<path d="M66 228V142Q66 102 128 83Q190 102 190 142V228Z" fill="#273234" stroke="#6b7466" stroke-width="3"/>
<circle cx="128" cy="130" r="31" fill="#101c23" stroke="#a8946f" stroke-width="2"/>
<path d="M128 91V104M128 156V169M89 130H102M154 130H167M101 103L110 112M146 148L155 157M101 157L110 148M146 112L155 103" stroke="#847450" stroke-width="2"/>
<path d="M115 146L104 170L94 206H162L152 170L141 146Z" fill="#65756c" stroke="#c0b394" stroke-width="2"/>
<path d="M128 147V202M107 178L128 166L149 178M111 198L128 185L145 198" fill="none" stroke="#273335" stroke-width="3"/>
<path d="M114 124Q114 107 128 107Q142 107 142 124L138 141H118Z" fill="#c0b798"/><path d="M118 125H124M132 125H138M125 135H131" stroke="#152024" stroke-width="3"/>
<rect x="74" y="207" width="108" height="20" fill="#37484a" stroke="#a18c65" stroke-width="2"/>
<path d="M84 214H172M84 220H172" stroke="#162329"/><path d="M59 200V218M197 200V218" stroke="#d2bd85" stroke-width="4"/><path d="M59 187Q50 201 59 203Q68 201 59 187M197 187Q188 201 197 203Q206 201 197 187" fill="#79ddc3"/>'''
library = '<path d="M55 94H201V225H55Z" fill="#19282b" stroke="#7c745b" stroke-width="3"/>'
for row in range(3):
 for col in range(10):
  x,y=61+col*13,101+row*37
  color=['#4f7370','#8e775c','#4a4b68','#62544f'][(row+col)%4]
  library+=f'<path d="M{x} {y+28}V{y+(col%3)*3}H{x+9}V{y+28}Z" fill="{color}" stroke="#0c161f" stroke-width="1.5"/><path d="M{x+2} {y+8}H{x+7}M{x+2} {y+23}H{x+7}" stroke="#c3af7f" stroke-width="1"/>'
 library+=f'<path d="M53 {132+row*37}H203" stroke="#9a8a6c" stroke-width="3"/>'
library+='''<path d="M49 192Q69 184 88 193T128 193T168 193T208 193V234H49Z" fill="#14434a" fill-opacity=".85"/>
<path d="M52 194Q72 186 92 194T132 194T172 194T205 194M62 212H100M144 218H193M88 229H142" fill="none" stroke="#76b7ae" stroke-width="2"/>
<path d="M128 71V91M114 91H142L138 112H118Z" fill="#baad7a" stroke="#344c50" stroke-width="2"/><path d="M122 96H134V105H122Z" fill="#8ee9ce"/>'''
archive='''<path d="M61 223H195M75 223L102 184M181 223L154 184M128 191V221" stroke="#8f8362" stroke-width="5"/>
<circle cx="128" cy="140" r="59" fill="#171b2d" stroke="#a18a5d" stroke-width="4"/>
<circle cx="128" cy="140" r="47" fill="none" stroke="#605d82" stroke-width="2"/>
<ellipse cx="128" cy="140" rx="20" ry="59" fill="none" stroke="#bea075" stroke-width="3" transform="rotate(35 128 140)"/>
<ellipse cx="128" cy="140" rx="59" ry="18" fill="none" stroke="#a7a57e" stroke-width="3" transform="rotate(-25 128 140)"/>
<path d="M128 103L153 155H103Z M94 126L160 153M113 179L147 102" fill="none" stroke="#a68ace" stroke-width="2"/>
<circle cx="128" cy="140" r="9" fill="#07121a" stroke="#85d5c8" stroke-width="3"/>'''
for i in range(24):
 a=i*pi/12
 x,y=128+54*cos(a),140+54*sin(a)
 ex,ey=128+49*cos(a),140+49*sin(a)
 archive+=f'<path d="M{x:.2f} {y:.2f}L{ex:.2f} {ey:.2f}" stroke="#a8906e" stroke-width="1.4"/>'
ossuary='''<circle cx="128" cy="124" r="39" fill="#10101b" stroke="#877596" stroke-width="3"/>
<circle cx="133" cy="120" r="30" fill="#070c12" stroke="#b8a080"/>
<path d="M128 163V227M104 175Q128 158 152 175M101 188Q128 170 155 188M99 201Q128 183 157 201M96 214Q128 198 160 214" fill="none" stroke="#b7b193" stroke-width="6"/>
<path d="M107 225L94 234M149 225L162 234" stroke="#8c8e79" stroke-width="5"/>'''
for x in (63,179):
 for y in (104,147,190):
  ossuary+=f'<path d="M{x-7} {y+25}V{y-5}Q{x+7} {y-22} {x+21} {y-5}V{y+25}Z" fill="#263337" stroke="#6b7467" stroke-width="2"/><path d="M{x-1} {y-2}Q{x+7} {y-13} {x+15} {y-2}V{y+10}H{x+12}V{y+16}H{x+2}V{y+10}H{x-1}Z" fill="#b6b194"/><path d="M{x+1} {y+2}H{x+5}M{x+9} {y+2}H{x+13}M{x+5} {y+11}H{x+9}" stroke="#172129" stroke-width="3"/>'
for name,title,body in [('crypt','Sepulcro de los custodios',crypt),('library','Biblioteca bajo la marea',library),('archive','Astrolabio del Nombre Anterior',archive),('ossuary','Relicario de los nichos vacíos',ossuary)]:
 (ROOT/f'environment-{name}.svg').write_text(svg(title,body),encoding='utf-8')
