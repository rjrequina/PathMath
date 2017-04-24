/**
* 
*								---- GAME ENGINE ----
* 
* Description : 
*	- This code has functions that serves as the engine of the game, the backbone
*	
*/


$(document).ready(function(){
	
	//  Variable for the board size
	var board_size = 5;

	// 	Variable for the number board generated.
	//  Also, this also serve as the score of the user.						
	var board_count = 0;

	//  Variable for the base value for the current random value
	//  Will be incremented and changed throughout the game
	var base_value = 6;	

	// Variable for the previous base value
	var prev_base_value = 0;

	// Variable of the time_limit of the game 
	var time_limit = 60000;				 
	
	// Variable for the timer width
	var timer_width = 600;

	// Variable for signal to update
	var update_board = true;
	
	// Variable for resetting the timer
	var reset_timer = false;

    // Variable for storing the current user sum
    var user_sum = 0;

    // Variable for storage of the value for the current board
    var board_value = 0;

    // Variable for the timer id for interval
    var timer_id = null;

    // Variable for the generate board id for interval
    var board_id = null;

    // Variable for determining if it is already game over
    var game_over = false;

	/**
	* Type : Helper Function
	* Return : Closure
	* Params : Integer (Time Limit)
	* Description :
	*  - Generates a function for countdown timer of the game
	*/

	function createTimer(time_limit){
		var start_time = Date.now();
		return function(){
			return time_limit - (Date.now() - start_time);
		}
	}

	/**
	* Type : Helper Function
	* Return : None
	* Params : None
	* Description :
	*  - Clears the table for the next cell values
	*/

	function clearTable(){
		for(var x = 0; x < board_size; x++){
			for(var y = 0; y < board_size; y++){
				$("#" + x.toString() + y.toString()).text("");
			}
		}
	}

	/**
	* Type : Game Main Function
	* Return : None
	* Params : None
	* Description : 
	*  - Generates the game board step values and the main value
	*/

	var game_timer = createTimer(60000);
	function checkTimer(){
		if(game_timer() >= 43000 && !game_over){
			$("#timer").width(timer_width);
			timer_width -= 40;
			if(user_sum == board_value){
				user_sum = 0;
				while(selected_idx.length > 0){
					$(selected_idx[selected_idx.length - 1]).removeClass("cell-clicked");
					$(selected_idx[selected_idx.length - 1]).removeClass("cell-current");
					selected_idx.pop();
				}
				reset_timer = true;
				selected_idx = [];
				board_count += 1;
				$("#board-count").text(board_count);
				setBaseValue(board_count);	
			} 
			if(reset_timer){
				clearTable();
				update_board = true;
				generateBoard();
				timer_width = 600;
				$("#timer").width(timer_width);
				game_timer = createTimer(60000);
			}
			reset_timer = false;
		} else {
			$("#timer").text("game over");
			$("#new-game").text("End Game!")
			$("#timer").width(600);
			$("#timer").css("background-color", "transparent");
			game_starts = true;
			game_timer = createTimer(60000);
			game_over = true;
		} 
		
	}

	/**
	* Type : Helper Function
	* Return : Integer (random picked number given a min and max)
	* Params : Integer, Integer (min, max)
	* Description :
	*  - Randomly picked a number given a minimum and maximum.
	*/

	function randomInRange(min, max) {
    	return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	* Type : Submain Function
	* Return : Integer (current base value)
	* Params : Integer (current board count)
	* Description : 
	*  - Checks the current board count and modify the base value 
	*    for complexity. 
	*/

	function setBaseValue(board_count){
		var inc_value = [3, 4, 5, 6, 7, 8, 9];
		if(board_count <= 10){
			if(board_count % 3 == 0){
				prev_base_value = base_value;
				base_value += inc_value[Math.floor(Math.random() * inc_value.length)];
			}
		} else if (board_count <= 20){
			if(board_count % 2 == 0 || board_count % 3 == 0){
				prev_base_value = base_value;
				base_value += inc_value[Math.floor(Math.random() * inc_value.length)];
			}
		} else {
			
			prev_base_value = base_value;
			base_value += inc_value[Math.floor(Math.random() * inc_value.length)];
		}

	}

	/**
	* Type : Helper Function
	* Return : Integer (randomized value)
	* Params : None
	* Description : 
	*  - Returns a randomized value within previous base and current base
	*/

	function generateValue(){
		value = randomInRange(prev_base_value, base_value);
		if(value <= 2){
			return 3;
		}
		return value;
	}

	function generateBoard(){
		if(update_board){
			board_value = generateValue();
			$("#board-value").text(board_value);
			generateOneValidPath(board_value);
			generateRemainingCellValues(board_value);
		}
		update_board = false;
	}


	// generateBoard();



	/**
	* Type : Helper Function
	* Return : Integer
	* Params : Integer (current value on board)
	* Description : 
	*   - Returns the suitable limit number of steps based on the
	*	  current value.
	*/

	function findStepsLimit(curr_value){
		var steps_choice = [7, 8, 9];
		if(curr_value < 7){
			return curr_value;
		} else {
			return steps_choice[Math.floor(Math.random() * steps_choice.length)];
		}
	} 

	/**
	* Type	: Helper Function
	* Return : Boolean 
	* Params : Object (contains x and y coord)
	* Description : 
	*  - Returns TRUE if a random selected move
	*	 is out of bounds, FALSE, otherwise. 
	*/

	function outOfBounds(coord){
		return (coord.x < 0 || coord.y < 0 || coord.x >= 5 || coord.y >= 5);
	}

	/**
	* Type : Helper Function
	* Return : Object (contains x and y coord)
	* Params : Integer (the move)
	* Description : 
	*   - Performs operation on the current x and y based on the 
	*     chosen move.
	*/

	function chooseMove(type, curr_x, curr_y){
		var coord = {x : curr_x, y : curr_y};
		if(type == 1){
			coord.x -= 1;
		} else if(type == 2){
			coord.x += 1;
		} else if(type == 3){
			coord.y += 1;
		} else if(type == 4){
			coord.y -= 1;
		}
		return coord;
	}

	/**
	* Type : Submain Function
	* Return : None
	* Params : Integer (current value on board)
	* Description : 
	* 	- Generates one valid path given a value for the current board
	*   - The possible moves are : 1 = up, 2 = down, 3 = left, 4 = right
	*/
	function generateOneValidPath(curr_value){
		var poss_moves = [1, 2, 3, 4];
		var step_x = Math.floor(Math.random() * board_size);
		var step_y = Math.floor(Math.random() * board_size);
		var num_steps = Math.floor(Math.random() * findStepsLimit(curr_value));
		if(num_steps <= 1){
			num_steps = 2;
		}

		var limit = Math.floor(curr_value / num_steps);
		var temp = [];
		var path_sum = 0;
		var step_value = 0;
		for(var i = 0; i < num_steps; i++){
			if(limit > 1){
				step_value = Math.floor(Math.random() * limit) + 1;
				path_sum += step_value;
			} else {
				step_value = limit;
				path_sum += limit;
			}
			var val = document.getElementById(step_x.toString() + step_y.toString()).textContent;
			if(val != ""){
			   $("#" + step_x.toString() + step_y.toString()).text(step_value + parseInt(val));
			} else {
			  $("#" + step_x.toString() + step_y.toString()).text(step_value);
			}
			var move_type = poss_moves[Math.floor(Math.random() * poss_moves.length)];
			var coord = chooseMove(move_type, step_x, step_y);
			while(outOfBounds(coord)){
				move_type = poss_moves[Math.floor(Math.random() * poss_moves.length)];
				coord = chooseMove(move_type, step_x, step_y);
			}

			if(i + 1 != num_steps){
				step_x = coord.x;
				step_y = coord.y;
			}			
		}

		// If the sum of the path created is not equal to the current value, 
		// the difference of the current value and the path sum is taken and
		// added to the last step of the path.

		if(path_sum != curr_value){
			var curr_step_val = document.getElementById(step_x.toString() + step_y.toString()).textContent;
			var step_value = (curr_value - path_sum) + parseInt(curr_step_val);
			$("#" + step_x.toString() + step_y.toString()).text(step_value);
		}
	}

	/**
	* Type : Submain Function
	* Return : None
	* Params : Integer(current value on board)
	* Description : 
	*  - Initializes the game board with random generated values
	*/
	function generateRemainingCellValues(curr_value){
		for(var x = 0; x < 5; x++){
			for(var y = 0; y < 5; y++){
				var cell_value = document.getElementById(x.toString() + y.toString()).textContent;
				if(cell_value == ""){
					var limit = Math.floor(Math.random() * curr_value) + 1;
					cell_value = Math.floor(Math.random() * curr_value) + limit;
					if(cell_value == curr_value){
						cell_value -= 1;
					}
					$("#" + x.toString() + y.toString()).text(cell_value);
				}
			}
		}
	}	
	
	//////////////////////////////////////////////////////
	// Accumulates the value of the clicked cell in the //
	// 				gameboard table						//
	//////////////////////////////////////////////////////

	
	var selected_idx = [];

	// checks if the current move is a valid move, returns true otherwise false
	//  
	function validUserMove(id){
		if(selected_idx.length > 0){	
			var i = selected_idx.length - 1; 
			for(var i = 0; i < selected_idx.length; i++){
				var prev_move = selected_idx[i].substring(1);
				var prev_x = prev_move.substring(0, 1);
				var prev_y = prev_move.substring(1, 2);

				var curr_move = id.substring(1);
				var curr_x = curr_move.substring(0, 1);
				var curr_y = curr_move.substring(1, 2);
				if(prev_x == curr_x){
					if(curr_y - prev_y == 1 || curr_y - prev_y == -1){
						return true;
					}
				} else if(prev_y == curr_y){
					if(curr_x - prev_x == 1 || curr_x - prev_x == -1){
						return true;
					}
				}
			}
			return false;
		}
		return true;
	}

	function accumVal(id){
		return function(){
			var substr_id = id.substring(1); 
			var str_val = document.getElementById(substr_id).textContent;
			if(selected_idx.indexOf(id) < 0){
				if(validUserMove(id)){
					user_sum += parseInt(str_val);
					if(selected_idx.length > 0){
						$(selected_idx[selected_idx.length - 1]).removeClass("cell-current")
					}
					selected_idx.push(id);
					$(id).addClass("cell-clicked");
					$(id).addClass("cell-current");
				}
			} else {
				var stop = false;
				var went_in_if = false;
				while(!stop && selected_idx.length > 0) {
					if(selected_idx[selected_idx.length - 1] != id){
						$(selected_idx[selected_idx.length - 1]).removeClass("cell-clicked");
						$(selected_idx[selected_idx.length - 1]).removeClass("cell-current")
						var id2 = selected_idx.pop(); 
						id2 = id2.substring(1);
						var val2 = document.getElementById(id2).textContent;
						user_sum -= parseInt(val2);
						went_in_if = true;
					} else {
						if(selected_idx.length == 1 && !went_in_if){
							$(selected_idx[selected_idx.length - 1]).removeClass("cell-clicked");
							$(selected_idx[selected_idx.length - 1]).removeClass("cell-current")
							var id2 = selected_idx.pop(); 
							id2 = id2.substring(1);
							var val2 = document.getElementById(id2).textContent;
							user_sum -= parseInt(val2);
						} else {
							if(selected_idx.length > 0){
								$(selected_idx[selected_idx.length - 1]).addClass("cell-current")
							}
						}
						stop = true;
					}
				}
			}
	
			
			
		}
	}
	for(var x = 0; x < 5; x++){
		for(var y = 0; y < 5; y++){
			cx = x.toString();
			cy = y.toString();
			id = "#" + cx + cy;
			$(id).click(accumVal(id))
		}
	}

	var game_starts = false;


	$("#new-game").click(	function (){
	 	if(game_starts){
	 		clearInterval(timer_id);
	 		clearInterval(board_id);
	 		$("#new-game").text("Start Game!")
	 		$("#board-count").text(0);
	 		board_count = 0;
	 	} else {
	 		game_over = false;
	 		$("#timer").text("");
			$("#timer").css("background-color", "#FF2400");
	 		clearTable();
	 		user_sum = 0;
	 		board_value = 0;
	 		base_value = 6;
	 		prev_base_value = 0;
			timer_id = setInterval(checkTimer, 1000);
			board_id =  setInterval(generateBoard, 100);
			$("#new-game").text("End Game!")
	 	}
	 	game_starts = !game_starts;
	});


});
