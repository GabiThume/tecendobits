# -*- coding: utf-8 -*-
## Using the library pyfuzzy http://pyfuzzy.sourceforge.net/epydoc/index.html

import sys
import xmltodict
import fuzzy.doc.structure.dot.dot
import subprocess

## Global variables
operator = ""
op_compound = "fuzzy.operator.Compound.Compound"
op_or = "fuzzy.norm.FuzzyOr.FuzzyOr()"
op_and = "fuzzy.norm.FuzzyAnd.FuzzyAnd()"
op_input = "fuzzy.operator.Input.Input"
op_not = "fuzzy.operator.Not.Not"

## Parse the system of an rule in a string that will be evaluated later
def parse(ins):
	global operator

	if 'or' in ins.keys():
		operator += op_compound+"(" + op_or+","
		parse(ins['or'])
		operator += "),"
	if 'and' in ins.keys():
		operator += op_compound+"(" + op_and+","
		parse(ins['and'])
		operator += "),"
	if 'not' in ins.keys():
		operator += op_not+"("
		parse(ins['not'])
		operator += "),"
	if 'in' in ins.keys():
		input_variable = ins['in']
		if type(input_variable) != type([]):
			input_variable = [input_variable]
		for each_in in input_variable:
			operator += op_input+"(system.variables[\"" + each_in['@label']+"\"].adjectives[\""+each_in['adjective']['@label']+"\"]),"

def parseOperator(ins):
	global operator	
	operator = ""
	
	if type(ins) != type([]):
		ins = [ins]
	
	#print "--------------------------------------------------------------------"	
	#print "\n Input:", ins, "\n"
	for x in ins:
		parse(x)
		#print "\n Operator:", operator
	#print "--------------------------------------------------------------------"	

## This functions create the system
def create_system():
	import fuzzy.System
	import fuzzy.InputVariable
	import fuzzy.OutputVariable
	import fuzzy.fuzzify.Plain
	import fuzzy.defuzzify.Dict
	import fuzzy.Adjective
	import fuzzy.Rule
	import fuzzy.operator.Input
	import fuzzy.operator.Compound
	import fuzzy.norm.Min
	import fuzzy.set.Function
	import fuzzy.set.Polygon
	import fuzzy.set.Triangle 
	import fuzzy.norm.FuzzyOr
	import fuzzy.norm.FuzzyAnd
	import fuzzy.operator.Not

	global operator

	system = fuzzy.System.System()

	## Converts XML file to a Python Dictionary
	xml_file = open("rules.xml", "r")
	d = xmltodict.parse(xml_file)

	out = None
	input_ = None
	output_ = None
	rule_ = None

	## BRANCH SCRIPT 
	filter_branch = d['script']

	## BRANCH INPUT
	input_branch = filter_branch['input']
	inputs = None
	if type(input_branch) == type([]):
		inputs = input_branch	
	else:
		inputs = [input_branch]

	## for each input
	for each_input in inputs:

		input_label = fuzzy.InputVariable.InputVariable(
			fuzzy.fuzzify.Plain.Plain(),
			description = each_input["@label"],
			min = 0.0,max=100.0,
			unit = "degrees"
		)

		## add the variable to system
		system.variables[each_input['@label']] = input_label

		## create the fuzzy sets low, medium and high
 		input_low_set = fuzzy.set.Polygon.Polygon([(1.,1.),(20.,1.),(40.,0.)])
		input_low = fuzzy.Adjective.Adjective(input_low_set)
		input_label.adjectives["low"] = input_low
		
		input_medium_set = fuzzy.set.Polygon.Polygon([(10.,0.),(50.,1.),(90.,0.)])	
		input_medium = fuzzy.Adjective.Adjective(input_medium_set)
		input_label.adjectives["medium"] = input_medium
		
		input_high_set = fuzzy.set.Polygon.Polygon([(60.,0.),(80.,1.),(100.,1.)])
		input_high = fuzzy.Adjective.Adjective(input_high_set)
		input_label.adjectives["high"] = input_high

	## This commented is for add the polygons in a dynamic way
	'''  
		input_label = fuzzy.InputVariable.InputVariable(
			fuzzy.fuzzify.Plain.Plain(),
			description = each_input["description"],
			min = each_input["min"],max=each_input["max"],
			unit = each_input["unit"]
		)
		
		## add the variable to system
		system.variables[each_input['@label']] = input_label
		##print "\nINPUT", each_input['@label'], each_input['adjective']

		for adj in each_input['adjective']:
			points = []
			for each_point in adj['polygon']['point']:
				points.append(eval(each_point))

			## fuzzy sets for input
			input_set = fuzzy.set.Polygon.Polygon(points)
			input_baixo = fuzzy.Adjective.Adjective(input_set)
			input_label.adjectives[adj['@label']] = input_baixo
			print "\n\n", adj['@label'], points
	'''

	## BRANCH OUTPUT 
	output_branch = filter_branch['output']
	outputs = None
	if type(output_branch) == type([]):
		outputs = output_branch	
	else:
		outputs = [output_branch]

	## vamos em cada output
	for each_output in outputs:
		## Definição do output - "we want use later the center of gravity method"?
		out = fuzzy.OutputVariable.OutputVariable(defuzzify=fuzzy.defuzzify.Dict.Dict())
		
		for each in each_output["adjective"]:	
			output_set = fuzzy.set.Function.Function()
			outputt = fuzzy.Adjective.Adjective(output_set)
			out.adjectives[each['@label']] = outputt
			
		## adiciona a consequencia ao sistema
		system.variables[each_output['@label']] = out
		##print system.variables['out'].adjectives

	## BRANCH FILTER RULE 
	rule_branch = filter_branch['Filter']['rule']
	rules = None
	if type(rule_branch) == type([]):
		rules = rule_branch	
	else:
		rules = [rule_branch]

	## para cada rule
	for each_rule in rules:
		## BRANCH IN 
		in_branch = each_rule['input']
		ins = None
		if type(in_branch) == type([]):
			ins = in_branch
		else:
			ins = [in_branch]
		
		## BRANCH OUT 
		out_branch = each_rule['out']

		## We are using just one out for now ;-)
		'''
		outs = None
		if type(out_branch) == type([]):
			outs = out_branch
		else:
			outs = [out_branch]

		for each_out in outs:
			print 'Output labels', each_out['@label'], each_out['adjective']['@label']

		'''
		## parsing the input to a string
		parseOperator(ins) 
		
		## If the last char of operator is a comma, then remove her		
		if operator[-1] == ",":
			operator = operator[:-1]

		## the rule is composed by an output and the evaluation of operator
		rule = fuzzy.Rule.Rule(
			adjective = system.variables[out_branch['@label']].adjectives[out_branch['adjective']['@label']],
			operator = eval(operator)
		)

		## Add rules to the system
		system.rules[each_rule["@label"]] = rule
		#print "Rule created: ", system.rules[each_rule["@label"]]
						
	return system

def main():
	system = create_system()

	output_values = {"intention" : 0.0} 
	input_val = {}
	input_val['belief(episodic, mbuild(self, emotion, happy_for))'] = float (sys.argv[1])
	input_val['belief(episodic, mbuild(camera, type, fake))'] = float (sys.argv[2])
	input_val['null'] = float (39.9)
	print "\n", input_val
	system.calculate(input=input_val , output = output_values)

	for classes in output_values.values():
		for classe in classes:
			print classe + " \t\t\t: %.2f" %classes[classe]


if __name__ == "__main__":
	## check if we want only generate docs
	if "doc" in sys.argv:
		from fuzzy.doc.plot.gnuplot import doc
		system = create_system()
		doc = doc.Doc("images/")
		# This creates images of geometry of each input
		doc.createDoc(system)
		# This creates 3D images of relationshio of some inputs
		doc.create3DPlot_adjective(system,"belief(episodic, mbuild(monica, want, action(monica, bath, self)))", "belief(episodic, mbuild(camera, type, fake))", "intention", "intention(safety)")

	elif "dot" in sys.argv:
		system = create_system()
		for name,rule in system.rules.items():
			cmd = "dot -T png -o '%s/Rule%s.png'" % ("images",name)
			print cmd
			f = subprocess.Popen(cmd, shell=True, bufsize=32768, stdin=subprocess.PIPE).stdin
			fuzzy.doc.structure.dot.dot.print_header(f,"XXX")
			fuzzy.doc.structure.dot.dot.print_dot(rule,f,system,"")
			fuzzy.doc.structure.dot.dot.print_footer(f)
		cmd = "dot -T png -o '%s/System.png'" % "images"
		print cmd
		f = subprocess.Popen(cmd, shell=True, bufsize=32768, stdin=subprocess.PIPE).stdin
		fuzzy.doc.structure.dot.dot.printDot(system,f)

	else: ## no docs => start main
		if len(sys.argv) == 1:
			print "Usage : \n" + sys.argv[0] +" [Grau emocional]\n"
			sys.exit(0)
		main()

