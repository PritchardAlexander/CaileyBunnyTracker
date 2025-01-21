# filter_dictionary.py
def is_valid_word(word):
    return word.isalpha() and word.islower() and len(word) >= 4 and len(word) <= 12

with open('2of12inf.txt', 'r') as infile, open('filtered_dictionary.txt', 'w') as outfile:
    for line in infile:
        word = line.strip()
        if is_valid_word(word):
            outfile.write(word + '\n')
