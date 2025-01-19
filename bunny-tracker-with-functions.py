# bunny-tracker.py
# Welcome message
print("==================================")
print("Welcome to the Bunny Care Tracker!")
print("==================================")
print("")

def get_bunny_name():
    bunny_name = input("Enter your bunny's name: ")
    return bunny_name

def get_bunny_age():
    # We can't just ask for age
    # We need to ask for the UNIT of age
    # THEN convert to days
    # THEN use a formula to convert that to years
    # THEN display the age in years
    # THEN display the age in human years

    # PSEDOCODE:
    # Ask for the age unit (days, weeks, months, years)
    # Ask for the age
    print("AGE UNITS:")
    print("ENTER 1 for days")
    print("ENTER 2 for weeks")
    print("ENTER 3 for months")
    print("ENTER 4 for years")
    bunny_age_unit_index = input("Enter your bunny's age unit: ")

    # Convert the age to days
    if bunny_age_unit_index == "1":
        bunny_age_unit = "days"
        bunny_age = input("Enter your bunny's age in days: ")
        bunny_age_in_days = int(bunny_age)

    # Convert the age to weeks
    elif bunny_age_unit_index == "2":
        bunny_age_unit = "weeks"
        bunny_age = input("Enter your bunny's age in weeks: ")
        bunny_age_in_days = int(bunny_age) * 7

    # Convert the age to months
    elif bunny_age_unit_index == "3":
        bunny_age_unit = "months"
        bunny_age = input("Enter your bunny's age in months: ")
        bunny_age_in_days = int(bunny_age) * 30

    # Convert the age to years
    elif bunny_age_unit_index == "4":
        bunny_age_unit = "years"
        bunny_age = input("Enter your bunny's age in years: ")
        bunny_age_in_days = int(bunny_age) * 365

    return bunny_age_unit_index, bunny_age_unit, bunny_age_in_days

def get_bunny_age_in_years(bunny_age_in_days):
    # Convert days to years
    bunny_age_in_years = bunny_age_in_days / 365

    # Round years to 2 decimal places
    bunny_age_in_years = round(bunny_age_in_years, 2)

    return bunny_age_in_years

def get_bunny_age_in_human_years(bunny_age_in_years):
    # Convert bunny years to human years
    if bunny_age_in_years < 1:
        bunny_age_in_human_years = bunny_age_in_years * 15
    elif bunny_age_in_years < 2:
        bunny_age_in_human_years = bunny_age_in_years * 10.5
    else:
        bunny_age_in_human_years = 2.5 + (bunny_age_in_years - 2) * 4

    return bunny_age_in_human_years

# Collecting the bunny's favorite food
bunny_favorite_food = input("Enter your bunny's favorite food: ")

# Displaying the collected information
print("")
print("Bunny Information:")
print(f"Name: {bunny_name}")
print(f"Age Unit Index: {bunny_age_unit_index}")
print(f"Age Unit: {bunny_age_unit}")
print(f"Age in Years: {bunny_age_in_years}")
print(f"Age in Human Years: {bunny_age_in_human_years}")
print(f"Favorite Food: {bunny_favorite_food}")