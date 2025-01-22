# bunny-story.py
import time

# # Type the following message into the terminal as if a human was typing it:
# message = "Once upon a time, there was a bunny. His name was Alex."

# # Print like it's being typed like a human, not all at once:
# for char in message:
#     print(char, end='', flush=True)
#     time.sleep(0.05)

# # Add a newline at the end
# print("\n")


# Turn the typing code into a function
def type_message(message, time_delay=0.05):
    for char in message:
        print(char, end="", flush=True)
        time.sleep(time_delay)
    # Add a newline at the end
    print("\n")


type_message("Alex met a bunny named Cailey. They became friends.")
type_message(". . . H O W E V E R . . .", 0.1)
type_message(
    """
    DarKNeSs EnGulFeD ThE LaNd!!!

    The wOrlD waS tAkEn oVeR by chAoS!!!

    NoT a sOuL wAs sAfE. ThE EnD WaS NeAr!!!
    THe bUnNies lOokEd foR a PlaCe To Hide,

    ~-~-~ CRASH ~-~-~ LIGHTNING ~-~-~
    !!!! BUT THERE WAS NO ESCAPE !!!!
    ~-~-~ CRASH ~-~-~ LIGHTNING ~-~-~
""",
    0.01,
)
