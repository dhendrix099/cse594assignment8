// Block Rotations:
// All pairs are x,y grid coordinates relative to the center block given to it by the constructor (-1, 5).
// The X would denote the center of rotation block in the simple diagrams. 
var blockRotations = [];
// Long block
//    [ ]
//    [X]
//    [ ]
//    [ ]
blockRotations[0] = [
  [[0,-1],[0,0],[0,1],[0,2]],
  [[-1,0],[0,0],[1,0],[2,0]],
  [[0,-2],[0,-1],[0,0],[0,1]],
  [[-2,0],[-1,0],[0,0],[1,0]] 
];

// Square block
//    [ ][ ]
//    [X][ ]
blockRotations[1] = [
  [[0,-1],[0,0],[1,0],[1,-1]],
  [[0,-1],[0,0],[1,0],[1,-1]],
  [[0,-1],[0,0],[1,0],[1,-1]],
  [[0,-1],[0,0],[1,0],[1,-1]]
];

// T block
//       [ ]
//    [ ][X][ ]
blockRotations[2] = [
  [[0,-1],[0,0],[-1,0],[1,0]],
  [[0,-1],[0,0],[0, 1],[1,0]],
  [[0,1],[0,0],[-1,0],[1,0]],
  [[0,-1],[0,0],[-1,0],[0,1]]
];

// S block
//       [X][ ]
//    [ ][ ]
blockRotations[3] = [
  [[-1,1],[0,1],[0,0],[1,0]],
  [[0,-1],[0,0],[1,0],[1,1]],
  [[-1,1],[0,1],[0,0],[1,0]],
  [[0,-1],[0,0],[1,0],[1,1]]
];

// Z block
//    [ ][X]
//       [ ][ ]
blockRotations[4] = [
  [[-1,0],[0,0],[0,1],[1,1]],
  [[0,0],[0,1],[1,0],[1,-1]],
  [[-1,0],[0,0],[0,1],[1,1]],
  [[0,0],[0,1],[1,0],[1,-1]]
];

// L block
//       [ ]
//       [X]
//       [ ][ ]
blockRotations[5] = [
  [[0,-1],[0,0],[0,1],[1,1]],
  [[-1,1],[-1,0],[0,0],[1,0]],
  [[-1,-1],[0,-1],[0,0],[0,1]],
  [[-1,0],[0,0],[1,0],[1,-1]]
];

// J block
//       [ ]
//       [X]
//    [ ][ ]
blockRotations[6] = [
  [[-1,1],[0,1],[0,0],[0,-1]],
  [[-1,-1],[-1,0],[0,0],[1,0]],
  [[0,1],[0,0],[0,-1],[1,-1]],
  [[-1,0],[0,0],[1,0],[1,1]]
];


function Block(ctx, blockType, x, y) {
  this.type = blockType;
  this.cells = [];
  this.rotation = 0;
  this.x = x; // Center cell x location
  this.y = y; // Center cell y location
  for(var i = 0; i < 4; i++) this.cells.push(new Cell(ctx, this.type, blockRotations[this.type][this.rotation][i][0] + this.x, blockRotations[this.type][this.rotation][i][1] + this.y));
  
  this.draw = function() {
	for (var i = 0; i < this.cells.length; ++i) this.cells[i].draw();
  }
  
  this.drop = function() {
	++this.y;
	for (var i = 0; i < this.cells.length; ++i) this.cells[i].drop();
  }
  
  this.canShiftLeft = function() {
	for(var i = 0; i < inactiveBlocks.length; i++) {
	  if(activeBlock.wouldCollideLeft(inactiveBlocks[i])) return false;
	}
	return true;
  }
  this.canShiftRight = function() {
	for(var i = 0; i < inactiveBlocks.length; i++) {
	  if(activeBlock.wouldCollideRight(inactiveBlocks[i])) return false;
	}
	return true;
  }
  this.moveLeft = function() {
	for (var i = 0; i < this.cells.length; ++i) {
	  if(this.cells[i].x <= 0) return false;
	}
	if(activeBlock.canShiftLeft()) {
	  for (var i = 0; i < this.cells.length; ++i) this.cells[i].moveL();
	  this.x--;
	}
	console.log("moveLeft");
  }
  this.moveRight = function() {
	for (var i = 0; i < this.cells.length; ++i) {
	  if(this.cells[i].x >= 9) return false;
	}
	if(activeBlock.canShiftRight()) {
	  for (var i = 0; i < this.cells.length; ++i) this.cells[i].moveR();
	  this.x++;
	}
	console.log("moveRight");
  }
  this.moveDown = function() {
	if(activeBlock.canDrop()) {
	  activeBlock.drop();
	}
	console.log("moveDown");
  }
  
  this.rotate = function() {  
    var newCells = [];
    var oldCells = activeBlock.cells;
    this.rotation++;
    if(this.rotation === 4) this.rotation = 0;
    for(var i = 0; i < 4; i++) {
	  newCells.push(new Cell(ctx, this.type, blockRotations[this.type][this.rotation][i][0] + this.x, blockRotations[this.type][this.rotation][i][1] + this.y));
    }
    for(var i = 0; i < 4; i++) {
	  if(newCells[i].x > 9) {
	    while(newCells[i].x > 9) for(var j = 0; j < 4; j++) newCells[j].moveL();
	  }
	  if(newCells[i].x < 0) {
	    while(newCells[i].x < 0) for(var k = 0; k < 4; k++) newCells[k].moveR();
	  }
	  if(newCells[i].y > 17) {
	    while(newCells[i].y > 17) for(var k = 0; k < 4; k++) newCells[k].y--;
	  }
    }
    activeBlock.cells = newCells;
    for(var j = 0; j < inactiveBlocks.length; j++) {
	  if(activeBlock.overLap(inactiveBlocks[j])) {
	    activeBlock.cells = oldCells;
	    if(this.rotation > 0) this.rotation--;
	    else this.rotation = 4;
	  }
    }
  }
}

Block.prototype.wouldCollideDown = function(otherBlock) {
  for (var i = 0; i < 4; ++i) {
	var cell = this.cells[i];
	for (var j = 0; j < otherBlock.cells.length; ++j) {
	  var otherCell = otherBlock.cells[j];
	  if (otherCell.x == cell.x && otherCell.y == cell.y + 1) {
		return true;
	  }
	}
  }
  return false;
};

Block.prototype.overLap = function(otherBlock) {
  for (var i = 0; i < 4; ++i) {
	var cell = this.cells[i];
	for (var j = 0; j < otherBlock.cells.length; ++j) {
	  var otherCell = otherBlock.cells[j];
	  if (otherCell.y == cell.y && otherCell.x == cell.x) {
		return true;
	  }
	}
  }
  return false;
};

Block.prototype.wouldCollideLeft = function(otherBlock) {
  for (var i = 0; i < 4; ++i) {
	var cell = this.cells[i];
	for (var j = 0; j < otherBlock.cells.length; ++j) {
	  var otherCell = otherBlock.cells[j];
	  if (otherCell.y == cell.y && otherCell.x == cell.x - 1) {
		return true;
	  }
	}
  }
  return false;
};

Block.prototype.wouldCollideRight = function(otherBlock) {
  for (var i = 0; i < 4; ++i) {
	var cell = this.cells[i];
	for (var j = 0; j < otherBlock.cells.length; ++j) {
	  var otherCell = otherBlock.cells[j];
	  if (otherCell.y == cell.y && otherCell.x == cell.x + 1) {
		return true;
	  }
	}
  }
  return false;
};

Block.prototype.canDrop = function() {
  for(var i = 0; i < 4; i++) { // Checks for collision with grid floor
	if(this.cells[i].y >= 17) return false;
  }
  for (var i = 0; i < inactiveBlocks.length; i++) {
	if (activeBlock.wouldCollideDown(inactiveBlocks[i])) {
	  return false;
	}
  }
  return true;
}

Block.prototype.fullDrop = function() {
  clearBlock(ctx, activeBlock, 5, -1);
  while(this.canDrop()) this.drop();
  inactiveBlocks.push(activeBlock);
  inactiveBlocks[inactiveBlocks.length - 1].draw();
  activeBlock = new Block(ctx, nextBlock.type, 5, -1);
  nextBlock = new Block(nex, Math.floor(Math.random()*7), 1, 1);
}