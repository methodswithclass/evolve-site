app.factory("doc.data", function () {

	

	var docs = [
	{
		name:"overview",
		demo:false,
		content:[
		{
			id:"welcome",
			title:"welcome",
			text:[
			[
				"Welcome to the world of evolutionary programming, or genetic algorithms. This site is about artificial intelligence and the subfield of evolutionary modeling of biological evolution that can be used to solve a variety of real world problems in engineering and computer science. It is used in cases when the optimum parameters of the end product are unknown, but the designers have a way to measure the performance of the end product. That way, they can test a variety of parameters to see if it meets their standard. Genetic algorithms provide a structured way to test a variety of different parameters, while also testing better and better parameters until an optimum set is achieved. This is done over a number of repeated generations, while each set of parameters per cycle can be thought of as the individuals in the generation."
			],
			[
				"The site is intended for those who have no technical background, each demonstration of the algorithm in action is interactive and can be manipulated simply and easily. It has the potential to present several demonstrations of the algorithm applied to different problems, all using the same algorithm. Check back often to see if new problems have been added, I'm always thinking of new things to demo.",
				"As the user of this site (as the runner of the algorithm) you can adjust how it's run in certain ways. There is a settings panel for each demo where you can change some values that makes the algorithm run differently, and ultimately you will get a different result. Have fun changing the values (the options for values will change in the future giving you more control ultimately), you can always return to default, which is a good middle ground. You can also control the algorithm as it runs, you can start and stop it at will, and add generations without having to start from scratch."
			]
			]
		},
		{
			id:"ga",
			title:"the genetic algorithm",
			text:[
			[
				"Genetic Algorithms, or GAs, model themselves after biological evolution. If you are ever faced with a problem with a bunch of things to balance, or you want to improve how well your program runs, granted you have some way to encode it's ability to run, and test it's performance, then a GA might be perfect for you. The GA works like biological evolution, it creates individual copies of your program or problem, and runs all of them against your test, ranking their performance. The best performing are mixed to create new individuals for the next generation. And the cycle is repeated.",
				"When the process starts, the GA will create a set of randomized parameters that can be called the individuals of the first generation. These individuals are then tested for their performance against the problem and they obviously do not perform well. Despite their random parameters, and their terrible performance altogether, there still is a disparity in performance across the whole generation. Some achieve a higher fitness than others no matter how badly. The 'best' performing individuals have their parameters mixed to create a new set of individuals for the next generation, and so forth."
			],
			]
		},
		{
			id:"mutation",
			title:"mutation",
			text:[
			[
				"But, however, before the new generation can be run in the same manner, a very important step must take place. This step is so important that it seems to almost prove biological evolution in a way (but don't hold me to that). The new individual's parameters must undergo a random mutation by some small percentage. If this step is not done, the GA fails to continue to increase the performance of the parameters after a certain point: it plateaus.",
				"This seems to mean, if I may be so bold, that in biological evolution, if mutations had not been part of the process (if there had been perfect replication of DNA from parent to child), life would not have evolved at all. This makes sense too, without mutation, in other words, without the addition of new information, eventually the pool of indivuals are just passing around the same genes, so it can't improve. But with mutation, new genetic information leads to variety that can be tested to pass or fail, while the successful genes remain, thus leading to complexity being injected into the system through the mechanism of simple mistakes (in the case of biological evolution, and intenetionally in the case of genetic algortithms).",
				"Once mutation is complete, the new generation is tested for performance and the process is repeated. After hundreds or thousands of generations, the resulting parameters will usually result in a well performing design for whatever you're trying to build. Applications of GAs are machine learning, training neural networks, and generalized optimization problems with a large number of paramters."
			]
			]
		}
		]
	},
	{
		name:"feedback",
		title:"feedback",
		demo:true,
		content:[
		{
			id:"scenario",
			title:"scenario",
			text:[
			[
				"The Feedback demo is a very simple demonstration. It doesn't really mean anything, it just shows how random numbers are all eventually brought to a single value over a number of generations by the algorithm. Hopefully it helps you gain some insight into how the algorithm is working. When you run the simulation, you'll see how the algorithm changed the set of numbers over all the generations. Notice how the points jump all over the plot: above to below, then above again, it seems to make no sense. This graph is showing a different individual in each step, the best 'performing,' so to speak, individual in each generation, they are not directly related to each other. Over the generations, the values far away from the intended value are being selected out of the set of points, so that all that remain are points that equal the intended value. This set of points can be said to have been 'taught' to contain all a certain value. This is machine learning, if not in a crude sense."
			]
			]
		},
		// {
		// 	id:"algorithm",
		// 	title:"algorithm",
		// 	text:[
		// 	[
		// 		"The problem and the goal are known, but we need to define a few things to use the GA. We need to define the genome, the thing that will be changed by the evolution process, and how we're going to measure the perfomance of the genome. This performace measure is sometimes called the fitness.",
		// 		"The genome is conveniently the very set of numbers we are trying to change, no need to get any more complicated than that. Since we want to bring the whole set to a target value, when all the numbers are at the target value the fitness is highest, and when the numbers are at either extreme away from the target, the fitness is lowest. So having the fitness based on each number's difference from the target value would make sense."
		// 	]
		// 	]
		// },
		// {
		// 	id:"simulation",
		// 	title:"simulation",
		// 	text:[
		// 	[
		// 		"Because the algorithm is directly changing values in the set, this problem lends itself to real time visualization. As the evolution is running, you can watch the set of numbers gradually gravitate toward the target value from generation to generation.",
		// 		"See the demo to see how it works. Enjoy."
		// 	]
		// 	]
		// }
		]
	},
	{
		name:"trash",
		title:"trash pickup",
		demo:true,
		content:[
		{
			id:"scenario",
			title:"scenario",
			text:[
			[
				"The Trash demo is a very interesting case. It is classic machine learning. A robot is tasked with cleaning trash in an grid. It has minimal sensation of the cells adjacent to it, whether they are a segment of the grid's outer wall or they contain trash or not. It needs a plan in order to know what to do at any given moment according to it's surroundings. Perfomance can be easily measured by the amount of trash picked up minus committing a number of punishable offenses including running into walls. The plan is designed so that no matter what arrangment of trash, for the same plan, the robot will yield a similar performance. The algorithm is the perfect tool in this case to find the optimal plan.",
				"The Trash demo is great because it shows the power of the evolutionary algorithm so plainly. After only a few generations (100 or so) the robot will usually end up running into walls or staying in place (wasting it's alotted steps,, gaining no points). But when you get into generations numbering five hundred or a thousand, all of a sudden the robot won't run into a single wall, it will pick up trash where it sees it, and it will even move toward trash in order to pick it up. Very smart.",
				"There is a phenomenon that happens at about the thousand generation mark that is truly remarkable and spooky. It appears that the robot learns patience. If it is in a position to immediately pick up a piece of trash, but, however, there are pieces adjacent on either side of it, the robot will not act as you would guess. It will practice 'patience', and forgoe picking up the trash immediately below it and instead move in either direction until it reaches the end of the line, and then zip down the entire line. This ends up being a much more efficient overall plan of attack on a large group of trash than greedily picking up the first thing it sees (which leads to splitting and isolating groups of trash that are now lost to the robot's view -- rememeber it only see's in it's immediate vicinity). The AI figures this superior strategy out all by itself. That is spooky. :-)"
			]
			]
		},
		// {
		// 	id:"school",
		// 	title:"school",
		// 	text:[
		// 	[	
		// 		"The yard will be broken up into a grid of sites, with each site either containing trash or not.",
		// 		"A virtual wall will be placed around the grid, so that if the robot tries to leave, it will bounce back into the grid.",
		// 		"The robot will be restricted to moving only to the sites in the grid, and it can pick up trash only from the site it's currently in."
		// 	],
		// 	[
		// 		"The robot has limited capability to see it's surroundings.",
		// 		"When the robot is on a site, it can only see what's under it, north of it, south of it, east of it, and west of it. It can also tell whether a site is a wall or whether it contains trash.",
		// 		"It has some available actions. It can move from site to site, it pick up trash from it's current site, and it can sit still and do nothing."
		// 	]
		// 	]
		// },
		// {
		// 	id:"ga",
		// 	title:"algorithm",
		// 	text:[
		// 	[
		// 		"So we're teaching the robot to have a good trash cleaning strategy. But what does the strategy actually look like?",
		// 		"The stratgey gives the robot a way to know what to do. Whatever situation the robot finds itself in, it can look up what to do.",
		// 		"A situation is the state of five sites: current, north, south, east, and west. The state is different whether there is trash or a wall in each of these sites.",
		// 		"The situations are arranged in an array. Each item of the array is a different situation, and to each situation, an action is assigned. Which action is assigned is what is being changed through the evolution process."
		// 	],
		// 	[
		// 		"The fitness of a given strategy is scored after the robot is run through a virtual trash scenario, with a finite number of moves, and seeing how many pieces of trash it picks up at the end minus how many times it tried to pick up trash when there is none and how many walls it runs into.",
		// 		"Nothing about the strategy is pre-determined. They start out being randomly assigned actions to each situation. Some random strategies will get lucky and be better than others, this begins the evolution process."
		// 	],
		// 	[
		// 		"See the demo to see how it all works. Enjoy."
		// 	]
		// 	]
		// }
		]
	},
	{
		name:"recognize",
		title:"image recognition",
		demo:true,
		content:[
		{
			id:"scenario",
			title:"scenario",
			text:[
			[
				"The Recognize demo involves two types of artifical intelligence. GAs are a form of AI, and neural networks are another. Neural networks can be used for image recognition. The only caveat with using them is that they must e trained to recognize the objects you want before you use them. Souunds like a GA is the perfect tool for the job."
			]
			]
		}
		]
	}
	]

	var get = function (name) {

		for (i in docs) {
			if (name == docs[i].name) {
				return docs[i];
			}
		}

		return {};

	}

	return {
		get:get
	}

});