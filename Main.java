//Name: Siddarth Iyer
//Date: 10/29/26
//Rev : 01
//Notes: None


import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import javax.swing.*;
import java.awt.*;
import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Minigame> games = new ArrayList<>();
        
        boolean running = true;

        JFrame frame = new JFrame("Minigame Suite");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(400, 300);
            frame.setLocationRelativeTo(null); 

            
            JPanel panel = new JPanel();
            panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));

            JLabel titleLabel = new JLabel("Minigame");
            titleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
            panel.add(titleLabel);

        while (running) {
            System.out.println("\n=============================");
            System.out.println("   MINIGAME  =-=-=  SELECT   ");
            System.out.println("=============================");
            
            if (games.isEmpty()) {
                System.out.println("There are no games that are currently available.");
            } else {
                for (int i = 0; i < games.size(); i++) {
                    System.out.println((i + 1) + ". Play " + games.get(i).getName());
                }
            }
            
            int exitOption = games.size() + 1;
            System.out.println(exitOption + ". Exit");
            System.out.print("Choose an option: ");

            if (scanner.hasNextInt()) {
                int choice = scanner.nextInt();

                if (choice >= 1 && choice <= games.size()) {
                    // Launch the selected game
                    Minigame selectedGame = games.get(choice - 1);
                    selectedGame.start();
                } else if (choice == exitOption) {
                    running = false;
                    System.out.println("Exited");
                } else {
                    System.out.println("Invalid choice. Please select from the menu.");
                }
            } else {
                System.out.println("Please enter a valid number.");
                scanner.next(); 
            }
        }
        scanner.close();
    }
}