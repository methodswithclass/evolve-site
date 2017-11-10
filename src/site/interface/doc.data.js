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
				"Welcome to the robust world of evolutionary programming, genetic algorithms, and machine learning. This site demonstrates how Genetic Algorithms, GAs, can be applied to a variety of problems. Come back frequently to see newly added problems."
			],
			[
				"The site presents several problems that need to be solved. Included with the site and the presented problems is an evolutionary algorithm module. It's a generic process, it is not different for the problem it is solving. Many problems with one method to solve them. In a way, the problems are solving themselves.",
				"The algortihm has a number of adjustable parameters. We would recommend you play with these values and see how they affect the solution that is generated. Changing these values and seeing the drastic range of possible outcomes makes it more clear that nothing about the final solution is pre-determined or hard coded.",
				"Feedback is the recommended first stop. It visually demonstrates that the GA is working and what exactly it is doing. You can watch the solution evolve before your eyes. And it will be a different evolution each time it's run.",
				"Trash is the meat and potatoes. When the final solution is achieved (this is up to you and your level of satisfaction, but 500 generations usually provides a decent result with the default settings), you can simulate the robot cleaning up the trash.",
				"While you watch the robot find all the trash in the grid, on its own, you might wonder where it got that sense of purpose. We could just be such good animators to be able to bring a block to life, or something else might be going on...?"
			],
			[
				"Evolutionary Biologists are constantly modifying, adapting, and improving the theory of evolution. It was only a matter of time before computer scientists got thier hands on it. They needed something to bring about and evolve the next phase of life on earth: the machines.",
				"No one said it was a good idea for a computer scientist to evolve a sense of humor."
			]
			]
		},
		{
			id:"real",
			title:"problem solving",
			text:[
			[
				"Solving problems, as it turns out, is rather difficult.",
				"As the number of dimensions that define a problem grows past a handful, the difficulty of solving it grows exponentially. In the real world, this exponential difficulty exists for most problems.",
				"Conventionally, this issue is reduced by fixing or approximating several dimensions while solving for others. The result is 'good enough' for most problems being addressed."
			],
			[
				"Optimization is a common problem. Finding the max, min, or other extreme of a set, function, or surface poses its own unique challenges.",
				"You might not know it, but you use them all the time. Spotify, Google Maps, Facebook, and YouTube all employ optimization algorithms billions of times a day for you and everyone else.",
				"Problem solving boils down to optimizing in almost every instance. 'Find the fastest or best method for doing x.'"
			]
			]
		},
		{
			id:"ga",
			title:"machine learning",
			text:[
			[
				"Some problems have solutions that do not make practical sense to program directly. Image recognition is a good example.",
				"Take cars for example. Because the color, orinetation, size, and shape of the car varies greatly from image to image, but we want to recognize all of them the same way, the solution to this recognition problem cannot be hard coded. It would take too much time to tell the computer how to recognize all cars in all photos.",
				"A much more economical, robust, and successful solution is to write a generic algorithm that can figure all of this out on its own. (This specific problem usually requires some human assistance to complete).",
				"The algorithm learns and evolves its own understanding of what cars look like by looking at hundreds of thousands of images of cars. Then, by much the same process that a human learns what a car looks like as a child, the computer recognizes a car of most any color, orientation, size, and shape.",
				"As with giving a man a fish, sometimes its better for the computer, and us, to teach the computer to recognize a car in a photo for itself.",
				"This is machine empowerment, really."
			],
			[
				"The learning process for this car example starts with the human teachers showing the learning computer a small set of a variety of cars and telling the computer that they are all cars. The computer has basic recognition software that allows it to see some basic things, but that software doesn't tell the computer what it's looking at.",
				"The teachers then give millions of pictures of a lot of things, including cars, to the computer and ask it find all the cars. Through a series of sorting, categorizing, and adapting the computer eventually gets good at seeing a car in any photo. With every pitcure it sees in the set, it adds what are not cars, and how different cars might look to its working library of a car.",
				"It's a single run, and each attempt to solve the problem of a car is different. The algorithm for recognizing a car is not changed. What is changed is the data set the algorithm references when asking if the thing it sees in the photo is a car."
			]
			]
		},
		{
			id:"ga",
			title:"genetic algorithms",
			text:[
			[
				"Genetic Algorithms, or GAs, work a bit differently. It's still machine learning, but this time the computer will change the algorithm with which it solves a problem. It's not just changing data, it's changing the algorithm itself. GAs don't do a single run of a million steps to improve the data, they attempt to solve a problem with hundreds of different algorthms at a time, and then repeat these hundred attempts thousands of times. Each time the attempts are repeated, the best perfomring algorithms are given preference and advance to the next phase of the learning process.",
				"The best solution to the problem evolves and adapts to different scenarios, and hones its ability to solve it. This process very closely mimics the process of natural biological evolution."
			],
			[
				"The GA will generate a number of solutions to the problem at random. They don't need to be any good and they definitely won't be.",
				"This first population of solutions make up the first 'generation' while each solution is an 'individual'. The solution itself is called the 'genome' of the individual and may be array of values. But the solution can be more complex than that depending on the usage.",
				"For each cycle of a generation, the individuals try to solve the problem to see how they do. They may be run against a number of versions of the problem to ensure a robust solution.",
				"The better the individual performs against the problem, the higher its 'fitness'."
			],
			[
				"The top performing individuals in the population are combined in pairs to make new individual solutions that will become the next generation.",
				"The reproduction process, or crossover, takes elements from two parent solutions and makes a set of new child solutions.",
				"The last step before the process is repeated is to change the children by some small amount before they enter the new generation and it is run in the same fashion. This is mutation."
			],
			[
				"Mutation is the key mechanism to this process. Without it, children would just be recombinations, and essentially copies, of thier parents, and the fitness of the best individual in the population would not improve much.",
				"Changing the genome in random ways each cycle allows for the evolution process to take the solution set (species) in different directions and explore the solution space (or, in the bilogical sense, to find new ways to adapt to the environment)."
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
				"There is a set of numbers, an array. But there's a problem: the values are spread out over a large range.",
				"If would would be nice if the numbers were all the same value or close to the same value."
			],
			[
				"This problem is actually trivial to solve. But as a test run of our new fangled method for solving problems, it's a good candidate for the genetic algorithm treatment."
			]
			]
		},
		{
			id:"algorithm",
			title:"algorithm",
			text:[
			[
				"The problem and the goal are known, but we need to define a few things to use the GA. We need to define the genome, the thing that will be changed by the evolution process, and how we're going to measure the perfomance of the genome. This performace measure is sometimes called the fitness.",
				"The genome is conveniently the very set of numbers we are trying to change, no need to get any more complicated than that. Since we want to bring the whole set to a target value, when all the numbers are at the target value the fitness is highest, and when the numbers are at either extreme away from the target, the fitness is lowest. So having the fitness based on each number's difference from the target value would make sense."
			]
			]
		},
		{
			id:"simulation",
			title:"simulation",
			text:[
			[
				"Because the algorithm is directly changing values in the set, this problem lends itself to real time visualization. As the evolution is running, you can watch the set of numbers gradually gravitate toward the target value from generation to generation.",
				"See the demo to see how it works. Enjoy."
			]
			]
		}
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
				"The yard is strewn with trash. Total disaster.",
				"We're sure as hell not gonna clean it up and there are no interns around. So we have sort of a problem.",
				"Why don't we build a robot to clean the yard for us? And we don't want to have sit around and remote control it either, we just want to send it out and forget about it. We have more important things to be doing with our lives, of course."
			],
			[
				"The physical contruction and operation of the robot is relatively easy. Metal body, wheels, legs, or maybe rotors if we're feeling bold, and a control system: it's all fairly straightforward.",
				"What's not at all straightforward is getting the robot to clean the trash without any human input or supervision.",
				"How will it obtain a high level strategy for cleaning trash in whatever environment we need it to work in?",
			],
			[
				"We could hard code a strategy ourselves. But if we do that, there are some basic issues.",
				"One, it's not likely we could even come up with a plan for the robot to get it to pick up every piece of trash. It has limited sensing capability, so the problem is not picking up the trash, it's finding it.",
				"Two, if we get lucky and happen to develop a good strategy that works for our yard, right now, how can we be sure it will work the next time there's a trash disaster?"
			],
			[
				"If you want to know how hard these two issues are to overcome ask Melenie Mitchell. She wrote a <a href='http://www.amazon.com/Complexity-Guided-Tour-Melanie-Mitchell/dp/0199798109/ref=sr_1_1?ie=UTF8&qid=1454557617&sr=8-1&keywords=complexity+a+guided+tour' target='_blank'>book</a> about it.",
				"Long story short, she went head-to-head with a GA to produce a strategy for this exact scenario. She lost.",
				"The take away would be: Don't mess with evolution, you will get trounced."
			],
			[
				"But maybe we're smarter than Dr. Melanie Mitchell, maybe we can succeeed where she failed. There's just one more little obstacle that we, normal everyday humans of any level of smarts, just can't overcome: we're just lazy.",
				"So we're gonna make some software to solve our problem for us. What we want to do is teach the robot with a program. We want the robot to clean up all trash no matter how the trash is strewn around the yard without us intervening during the cleaning process.",
				"We will use a genetic algorithm as the teaching method."
			]	
			]
		},
		{
			id:"school",
			title:"school",
			text:[
			[	
				"The yard will be broken up into a grid of sites, with each site either containing trash or not.",
				"A virtual wall will be placed around the grid, so that if the robot tries to leave, it will bounce back into the grid.",
				"The robot will be restricted to moving only to the sites in the grid, and it can pick up trash only from the site it's currently in."
			],
			[
				"The robot has limited capability to see it's surroundings.",
				"When the robot is on a site, it can only see what's under it, north of it, south of it, east of it, and west of it. It can also tell whether a site is a wall or whether it contains trash.",
				"It has some available actions. It can move from site to site, it pick up trash from it's current site, and it can sit still and do nothing."
			]
			]
		},
		{
			id:"ga",
			title:"algorithm",
			text:[
			[
				"So we're teaching the robot to have a good trash cleaning strategy. But what does the strategy actually look like?",
				"The stratgey gives the robot a way to know what to do. Whatever situation the robot finds itself in, it can look up what to do.",
				"A situation is the state of five sites: current, north, south, east, and west. The state is different whether there is trash or a wall in each of these sites.",
				"The situations are arranged in an array. Each item of the array is a different situation, and to each situation, an action is assigned. Which action is assigned is what is being changed through the evolution process."
			],
			[
				"The fitness of a given strategy is scored after the robot is run through a virtual trash scenario, with a finite number of moves, and seeing how many pieces of trash it picks up at the end minus how many times it tried to pick up trash when there is none and how many walls it runs into.",
				"Nothing about the strategy is pre-determined. They start out being randomly assigned actions to each situation. Some random strategies will get lucky and be better than others, this begins the evolution process."
			],
			[
				"See the demo to see how it all works. Enjoy."
			]
			]
		}
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
				"Recognize attempts to teach a neural network how to regognize images of handwritten numbers as the actual numbers they represent."
			]
			]
		},
		{
			id:"demo",
			title:"demo",
			text:[
			[
				"After the evolution of the solution you can test the artificial agent you've created to see how well it performs."
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