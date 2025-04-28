export default function ColourTest() {
	return (
		<div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
			<div style={{width: "200px", height: "200px"}} className="draggable cNeutral"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable c1"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable locked-c1"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable c2"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable locked-c2"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable c3"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable locked-c3"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable c4"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable locked-c4"></div>
			<div style={{width: "200px", height: "200px"}} className="draggable cRainbow"></div>
			<div style={{width: "200px", height: "200px", position: "relative"}} className="draggable locked-cRainbow"></div>
		</div>
	);
}